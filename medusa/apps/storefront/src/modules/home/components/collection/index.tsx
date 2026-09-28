import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import { isProductInStock } from "@lib/util/is-product-in-stock"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CollectionProductCard from "./product-card"

const QUESTIONS = ["Where you drive", "Your cabin size", "Scents you already wear"]

export default async function Collection({
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
      fields: "title,handle,metadata,*variants.calculated_price,+variants.inventory_quantity",
    },
  })

  const inStock = products.filter(isProductInStock)
  if (!inStock.length) return null

  return (
    <div id="collection" className="content-container py-12 small:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <span className="font-display text-large-semi text-brand-primary">
            The Collection
          </span>
          <Heading level="h2" className="text-2xl-semi small:text-3xl-semi mt-2">
            Seven compositions
          </Heading>
        </div>
        <Text className="text-ui-fg-subtle max-w-sm">
          Each one is a complete fragrance, not a variant. Pick by the drive
          you take most.
        </Text>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-5 small:gap-6">
        {inStock.map((product: HttpTypes.StoreProduct, i: number) => (
          <CollectionProductCard
            key={product.id}
            product={product}
            tilt={i % 2 === 0 ? -1.5 : 1.5}
          />
        ))}
        <div className="relative overflow-hidden rounded-large bg-brand-dark p-6 flex flex-col justify-center gap-4">
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-brand-primary/40 blur-2xl animate-orbit" />
          <span className="relative w-fit inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xsmall-regular uppercase tracking-wide text-brand-secondary">
            Scent Finder
          </span>
          <Text className="font-display text-white text-large-semi relative">
            Find the one that suits your drive
          </Text>
          <div className="flex flex-col gap-2.5 relative">
            {QUESTIONS.map((q, i) => (
              <div key={q} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-small-semi text-gray-900">
                  {i + 1}
                </span>
                <Text className="text-white/85 text-small-regular">{q}</Text>
              </div>
            ))}
          </div>
          <LocalizedClientLink href="/#experience" className="relative w-fit">
            <span className="inline-flex items-center gap-2 text-small-semi text-brand-primary hover:text-white transition-colors">
              Discover your scent →
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
