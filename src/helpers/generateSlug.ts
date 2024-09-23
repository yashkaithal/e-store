export function generateSlug(title: String) {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return slug;
}
