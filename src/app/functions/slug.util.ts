export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // remove non-alphanumeric
    .replace(/\s+/g, '-')          // spaces -> hyphens
    .replace(/-+/g, '-');          // collapse multiple hyphens
}