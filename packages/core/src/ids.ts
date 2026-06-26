const DEFAULT_ID_PREFIX = "object";

export function createObjectId(prefix = DEFAULT_ID_PREFIX): string {
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);

  return `${prefix}-${randomId}`;
}
