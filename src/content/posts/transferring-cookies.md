---
title: "Transferring cookies from one domain to another"
description: "Migrating session cookies from one domain to another is trickier than it seems. In this post, I explore how we approached this problem at Inflection AI."
publishedOn: 2023-11-14
---

Earlier this year, we decided at [Inflection](https://inflection.ai) that we wanted to change the domain for our primary web application [Pi](https://pi.ai) from `heypi.com` to `pi.ai`. Now you can easily start redirecting users from the old domain to the new domain, but these users' session cookies won't follow them to the new domain. Cookies are, for good reason, specific to a single domain. But we wanted to avoid forcing logged in users to log in again on the new domain. There are many several ways of achieving this, but in this post, I'd like to describe our own approach and how we got there.

Let's start with a simple thought experiment. Suppose you had a session token of `ABC123`. In theory, you could have a server that intercepts requests to the old domain `heypi.com`, reads the session token off of the request, and appends it as a query string parameter to redirect to the new domain: `pi.ai?session=ABC123`. On the new domain, you could then read this query string value and respond to the request with a

```bash
Set-Cookie: session=ABC123; ...
```

response header to get the cookie transferred to the new domain. Now, this works - users will have their sessions transferred, but it comes with some unfortunate security implications. Session cookies are extremely sensitive from a security standpoint and you ideally never want them exposed as part of a URL. If the session is part of the URL exposed to a user, they could copy it, send a link to someone, and inadvertently share their session by doing so. You also run the risk of having these session tokens show up in internal logs, where they don't belong. To mitigate these security risks, we implemented a couple measures.

## Using an encrypted transfer token

Instead of appending the session cookie directly to the URL, we instead generate what we call a **transfer token**. The server can take the session cookie value along with the expiration time for the transfer token, serialize them to JSON, encrypt them using [symmetric-key encryption](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) and append this transfer token to the URL. On the new domain, the server can then decrypt this token, make sure it's still valid, and then set the cookie on the new domain.

In practice, the code to generate these transfer tokens looked like this:

```ts
const transferToken = encrypt(
  JSON.stringify({
    sessionToken,
    expiresAt: Date.now() + MINUTE_IN_MS,
  }),
);
```

This addresses most of the security concerns we discussed earlier. Now the actual session token never shows up in the URL. And even if somehow, a malicious actor is able to gain access to a transfer token, they only have one minute to use it. Since we were using HTTPS, these transfer tokens were encrypted in transit but they were still visible to both the user and in our logs. However, since these tokens expire very quickly, they are dramatically less sensitive than the session tokens themselves. We felt comfortable with the possibility these might show up in our internal logs.

## Implementing an intermediate transfer page

While HTTPS ensures that the query string isn't visible in transit, it is still visible to the user's browser. To minimize the risk of a user accidentally copying a URL that contained the transfer token, we decided we wanted to strip out the transfer token from the URL as quickly as possible. Now, this could be done through client-side Javascript, but we opted to do this with a special page that would strip out the query parameter and handle setting the cookie on the new domain.

So altogether, our transfer process looked like this:

1. When users would hit the old domain, the server would read their session cookie, generate a transfer token, and redirect the user to a page on the new domain with the transfer token in the query string: `pi.ai/transfer?token=abc123...`.
2. On this transfer page for the new domain, we would decrypt the transfer token, ensure it was not expired, and issue a redirect for our main page `pi.ai` along with a `Set-Cookie` header that transferred over the session cookie.

## Conclusion

By using this approach, we allowed users to seamlessly migrate from the old domain to the new one while preserving their sessions. Finally, after all active sessions had expired, we were able to go back and clean up this logic.
