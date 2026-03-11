export function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

export function unique(values) {
  return Array.from(new Set(values));
}

export function sortBy(items, comparator) {
  return [...items].sort(comparator);
}
