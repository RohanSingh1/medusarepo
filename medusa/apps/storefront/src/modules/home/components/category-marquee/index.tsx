import { listCategories } from "@lib/data/categories"

// Top-level categories only (no parent_category_id) keep the ticker to real,
// meaningful names instead of the full ~60-category tree.
export default async function CategoryMarquee() {
  const categories = await listCategories({ limit: 100 })

  const names = categories
    .filter((c) => !c.parent_category_id)
    .map((c) => c.name)

  if (names.length < 4) {
    return null
  }

  // Doubled so the CSS translateX(-50%) loop has no visible seam.
  const looped = [...names, ...names]

  return (
    <div className="overflow-hidden py-5">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {looped.map((name, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="font-display text-large-semi uppercase tracking-wide text-ui-fg-muted/40">
              {name}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
          </div>
        ))}
      </div>
    </div>
  )
}
