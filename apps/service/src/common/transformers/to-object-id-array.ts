import { Types } from "mongoose";

export const toObjectIdArray = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null) return undefined;

  const rawArray = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [value];

  const normalized = rawArray
    .map((item) => (typeof item === "string" ? item.trim() : item))
    .filter((item) => item !== "");

  return normalized.map((item) =>
    Types.ObjectId.isValid(item) ? new Types.ObjectId(item) : item
  );
};
