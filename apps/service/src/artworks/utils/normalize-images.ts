export const normalizeImages = (images?: string[]) => {
  if (!images) return undefined;

  return images
    .map((img) => img?.trim())
    .filter((img) => Boolean(img));
};
