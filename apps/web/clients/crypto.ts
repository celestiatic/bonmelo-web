import { createHash } from "crypto";

export function hashString(string) {
  if (string) return createHash("sha256").update(string).digest("hex");
}
