export const MAX_TAGS = 15;
export const MAX_TAG_LENGTH = 50;

export const normalizeTags = (tags?: string[]): string[] => {
  if (!Array.isArray(tags)) return [];

  const normalized = tags
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  const deduped = Array.from(new Set(normalized));

  return deduped.slice(0, MAX_TAGS);
};
