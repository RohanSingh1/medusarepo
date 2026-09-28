import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import { getFragranceMeta } from "@lib/util/fragrance"
import { isProductInStock } from "@lib/util/is-product-in-stock"
import { Heading, Text } from "@modules/common/components/ui"
import ExperienceTabs from "./tabs"

export default async function Experience({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 20,
      fields:
        "title,handle,metadata,*variants.calculated_price,+variants.inventory_quantity",
    },
  })

  const entries = products.filter(isProductInStock).map((p: HttpTypes.StoreProduct) => {
    const meta = getFragranceMeta(p)
    return {
      id: p.id,
      name: p.title,
      accent: meta.accent,
      tint: meta.tint,
      topNotes: meta.topNotes,
      heartNotes: meta.heartNotes,
      baseNotes: meta.baseNotes,
    }
  })

  if (entries.length < 2) return null

  return (
    <div id="experience" className="content-container py-12 small:py-24">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="font-display text-large-semi text-brand-primary">
          Discover Your Scent
        </span>
        <Heading level="h2" className="text-2xl-semi small:text-3xl-semi mt-2 mb-3">
          How a fragrance unfolds in a cabin
        </Heading>
        <Text className="text-ui-fg-subtle">
          Choose a composition, then step through its three layers.
        </Text>
      </div>
      <ExperienceTabs entries={entries} />
    </div>
  )
}
