import { v4 as uuidv4 } from "uuid";

export function sanitizeFileName(originalName) {
  if (!originalName) return `file-${uuidv4()}`;

  const parts = originalName.split(".");
  const extension = parts.pop().toLowerCase();
  const name = parts.join(".");

  const cleanName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  return `${cleanName}-${uuidv4()}.${extension}`;
}
