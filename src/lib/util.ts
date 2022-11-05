const compare = <T>(a: T, b: T) => {
  if (a > b) return 1;
  if (b > a) return -1;
  return 0;
};

const createComparer = <T>(
  getKey: (item: T) => number | string,
  descending = false
) =>
  descending
    ? (a: T, b: T) => compare(getKey(b), getKey(a))
    : (a: T, b: T) => compare(getKey(a), getKey(b));

export const sortBy = <T>(
  array: T[],
  getKey: (item: T) => number | string,
  descending = false
) => {
  array.sort(createComparer(getKey, descending));
  return array;
};

export const formatPublishedOn = (publishedOn: string) => {
  const publishedOnDate = new Date(publishedOn);
  return publishedOnDate.toLocaleDateString("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  });
};

export const stripSuffix = (url: string, suffix: string) => {
  if (url.endsWith(suffix)) {
    return url.slice(0, -suffix.length);
  } else {
    return url;
  }
};
