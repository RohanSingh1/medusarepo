import { HttpTypes } from "@medusajs/types"

// Reads the per-fragrance content stored in product.metadata by the
// reset-to-perfume-catalog migration script (accent/soft/tint colours,
// tagline, mood, smell/lasts copy, and comma-joined top/heart/base notes).
export function getFragranceMeta(product: HttpTypes.StoreProduct) {
  const m = (product.metadata ?? {}) as Record<string, unknown>
  const str = (key: string, fallback = "") =>
    typeof m[key] === "string" ? (m[key] as string) : fallback
  const list = (key: string) =>
    str(key)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

  return {
    tagline: str("tagline"),
    mood: str("mood"),
    smell: str("smell"),
    lasts: str("lasts"),
    accent: str("accent", "#753666"),
    soft: str("soft", "#2c1326"),
    tint: str("tint", "#eae5de"),
    topNotes: list("top_notes"),
    heartNotes: list("heart_notes"),
    baseNotes: list("base_notes"),
  }
}
