export const generateSlug = (title: string): string => {
  const timestamp = Date.now();
  return `${title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')}-${timestamp}`;
};
