function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function createId(prefix, label = '') {
  const entropy = Math.random().toString(36).slice(2, 8);
  const base = slugify(label);
  return [prefix, base || 'item', entropy].filter(Boolean).join('-');
}
