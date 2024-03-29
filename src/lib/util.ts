const compare = <T>(a: T, b: T) => {
  if (a > b) return 1;
  if (b > a) return -1;
  return 0;
};

const createComparer = <T>(
  getKey: (item: T) => number | string | Date,
  descending = false,
) =>
  descending
    ? (a: T, b: T) => compare(getKey(b), getKey(a))
    : (a: T, b: T) => compare(getKey(a), getKey(b));

export const sortBy = <T>(
  array: T[],
  getKey: (item: T) => number | string | Date,
  descending = false,
) => {
  array.sort(createComparer(getKey, descending));
  return array;
};

export const formatPublishedOn = (publishedOn: Date) => {
  return publishedOn.toLocaleDateString("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  });
};

export const chunk = <T>(iterable: Iterable<T>, chunkSize: number): T[][] => {
  const result: T[][] = [];
  let current: T[] = [];

  for (const item of iterable) {
    current.push(item);

    if (current.length >= chunkSize) {
      result.push(current);
      current = [];
    }
  }

  if (current.length > 0) {
    result.push(current);
  }
  return result;
};
