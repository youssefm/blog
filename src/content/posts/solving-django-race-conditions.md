---
title: "Solving Django race conditions with select_for_update and optimistic updates"
description: "If you're running Django at scale, you're bound to run into race conditions sooner or later. In this blog post, we explore two different methods of solving a common class of race conditions: select_for_update and optimistic updates."
publishedOn: 2023-01-12
---

If you're running Django at scale, you're bound to run into race conditions sooner or later. These race conditions can take many forms, but I'd like to explore an especially common form in this blog post. Let's start with an example.

Suppose you have the following Django model:

```python
class Order(models.Model):
    class State(models.TextChoices):
        PLACED = "placed"
        COMPLETED = "completed"
        CANCELED = "canceled"

    state = models.TextField(choices=State.choices, default=State.PLACED)
```

It's a simple `Order` model with just one field: `state`. All of our orders begin in the `placed` state and eventually transition either into the `completed` state or the `canceled` state. But critically, we've designed our system to depend on the fact that an order can never go from the `completed` state to the `canceled` state or from the `canceled` state to the `completed` state.

We might write the following Django REST framework viewset to implement our state transitions:

```python
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=True, methods=["POST"])
    def complete(self, request, pk=None):
        order = Order.objects.filter(id=pk).first()
        if not order:
            raise NotFound()
        if order.state != Order.State.PLACED:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        order.state = Order.State.COMPLETED
        order.save()
        return Response()

    @action(detail=True, methods=["POST"])
    def cancel(self, request, pk=None):
        order = Order.objects.filter(id=pk).first()
        if not order:
            raise NotFound()
        if order.state != Order.State.PLACED:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        order.state = Order.State.CANCELED
        order.save()
        return Response()
```

Unfortunately, we've done nothing so far to prevent an order from transitioning between the two terminal states. Imagine a completion request and a cancellation request come in at the same time. They both see that the order exists and is in the `placed` state, the completion request marks the order as `completed`, and finally the cancellation request sets the state to `canceled`. So the same order has been marked as both `completed` at one point in time and then as `canceled` at a later point in time, which should never happen. We have a race condition.

## Adding database transactions

So how do we fix this? The first thing you might try is to wrap your code in database transactions. Let's see what that looks like:

```python {2}
@action(detail=True, methods=["POST"])
@transaction.atomic
def complete(self, request, pk=None):
    order = Order.objects.filter(id=pk).first()
    if not order:
        raise NotFound()
    if order.state != Order.State.PLACED:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    order.state = Order.State.COMPLETED
    order.save()
    return Response()
```

We've simply added the `@transaction.atomic` decorator to each of our `complete` and `cancel` functions. So now we're done right? Transactions made our functions atomic and everything is right in the world.

Well, not so fast. You might be surprised to find out that **we still have a potential race condition**.

To understand how this is possible, we need to understand a little about transaction isolation levels. Isolation levels refer to the guarantees a database makes about how different transactions interact with each other. Django defaults to the [read committed isolation level](<https://en.wikipedia.org/wiki/Isolation_(database_systems)#Read_committed>). In this isolation level, you can read a row from your database with a `SELECT` query, issue the same `SELECT` query later on in the transaction, and get different results. We call these **non-repeatable reads**.

So in our case, Django could kick off two transactions. In both transactions, we would first read that the order is in the `placed` state. Then in one of the transactions, we would mark the order as `completed` and commit it to the database. Then, the other transaction would now change the `completed` value to `canceled` and commit that to the database. The non-repeatable read here refers to the fact that we read the value as `placed` in the cancellation transaction, and had we read that value after the completion transaction had been committed, we would have read `completed` instead.

Fundamentally, we have a gap between where we **read** the state of the order and where we **wrote** to it. Another transaction was able to slip in between the read and the write and invalidate our assertion that the order was in the `placed` state. Despite the database transactions, our operations are not truly atomic.

## Solving the race condition with `select_for_update`

In read committed isolation level, we've seen how reading a value does not guarantee that value won't be changed by a concurrent transaction. Writes, however, work differently. Within a transaction, once you write to a row, no other transaction can write to that row until the transaction completes. One way to think about this is that by writing to a row, you are effectively acquiring a **row-level lock** for the rows that you've written to for the remainder of the transaction.

Now it would be great if we could do the same for reads. If we could only tell the database to lock the order row when we **read** it rather than when we **write** to it, we could avoid other transactions invalidating our precondition. Thankfully, most flavors of SQL provide a way of doing this with the `SELECT FOR UPDATE` command. It provides you a way to fetch rows from the database while also asking the database to treat the read as a write and acquire row-level locks on the rows that are read. Let's see how we can apply this in Django:

```python {4}
@action(detail=True, methods=["POST"])
@transaction.atomic
def complete(self, request, pk=None):
    order = Order.objects.select_for_update().filter(id=pk).first()
    if not order:
        raise NotFound()
    if order.state != Order.State.PLACED:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    order.state = Order.State.COMPLETED
    order.save()
    return Response()
```

We've added a call to [select_for_update](https://docs.djangoproject.com/en/4.1/ref/models/querysets/#select-for-update) when we query the database for our order. And just like that, we've fixed our race condition. Now, whichever request reads the order first will acquire a lock for the order until the end of the request. The other request will block until the first request completes, at which point it will be able to read the new value of the order state.

You may have noticed that we read the order row and later wrote to the row within the transaction. In fact, this is why `SELECT FOR UPDATE` is named as it is. We're effectively letting the database that we want to read (`SELECT`) database rows for the purpose of later writing to them (`FOR UPDATE`).

To effectively use `select_for_update`, there are a couple things to note:

- `select_for_update` only works within the scope of a database transaction. It's effectively meaningless outside the scope of a database transaction and so Django will raise a `TransactionManagementError` if you try to call it outside that context.
- To properly fix race conditions of this type, you must apply `select_for_update` in every affected transaction. I've only shown `complete` above for brevity, but we must update both `complete` and `cancel` to prevent the race condition from occuring in either direction.

## Solving the race condition with optimistic updates

Now let's look at a different method of approaching the same problem. In our original code, we were making two database queries for each request. We were first fetching the order from the database, checking the state of the order (our **[precondition](https://en.wikipedia.org/wiki/Precondition)**), and finally updating the state of the order. What if instead we could write a single SQL statement and make the precondition **part of the database command**? We can do just that with `update`:

```python {9-14}
@action(detail=True, methods=["POST"])
def complete(self, request, pk=None):
    order = Order.objects.filter(id=pk).first()
    if not order:
        raise NotFound()
    if order.state != Order.State.PLACED:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    rows_updated = Order.objects.filter(
        id=pk,
        state=Order.State.PLACED,
    ).update(state=Order.State.COMPLETED)
    if not rows_updated:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response()
```

We still fetch the order and make sure it exists and is in the right state. But when we go to update the order, instead of setting the `state` field and saving it to the database, we also filter by `state=Order.State.PLACED`. If no other request has changed our order's state, then we expect the `state` filter to match our order row, the order's state to be updated, and the `rows_updated` to be `1`. On the other hand, if the order's state was changed by another request, then we expect the `state` filter not to match, the order's state not to be updated, and the `rows_updated` to be `0`. We are **optimistically** trying to update our order state under the assumption that the state hasn't changed from under us.

Again, we've solved our race condition. When two concurrent requests come in, the first request that runs the `update` will successfully update the state while the second request will fail to update the order state and return a `400 Bad Request` as a result.

## Conclusion

In this post, we've looked at a common class of potential race conditions in which you:

- Query the database for rows
- Check for certain conditions to be true
- Update those rows in the database

And described two different ways of solving these race conditions:

- Acquiring row level locks with `select_for_update`
- Optimistically updating the rows under the assumption the preconditions are still true

So which method should you use? I would recommend trying to address your concurrency problems with optimistic updates first. If you're able to do so, you avoid the overhead of a database transaction and the cost of acquiring row-level locks, which can significantly affect the performance of your application under heavy contention.

However, you may not always be able to write your preconditions as part of a SQL statement. Suppose you have a long function that makes sure a database object looks right before you apply an operation. It may be challenging or impossible to convert all that code into Django `filter` clauses. In practice, you're likely to find that both methods are worth considering when you're thinking about concurrency.
