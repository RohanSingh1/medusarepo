import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"

export default async function Marquee({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 20, fields: "title" },
  })

  const names = products.map((p) => p.title)
  if (names.length < 2) return null

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
