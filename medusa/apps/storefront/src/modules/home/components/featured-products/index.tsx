import { HttpTypes } from "@medusajs/types"

import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { isProductInStock } from "@lib/util/is-product-in-stock"
import { Heading, Text } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FeaturedProductCard from "./featured-product-card"

const FEATURED_COLLECTION_HANDLE = "featured"
const FEATURED_PRODUCT_COUNT = 7

const STEPS = [
  "Browse by room or material",
  "Compare finishes side by side",
  "Order a sample before you buy",
]

export default async function FeaturedProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const collection = await getCollectionByHandle(FEATURED_COLLECTION_HANDLE)
  if (!collection) return null

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      limit: FEATURED_PRODUCT_COUNT * 2,
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    },
  })

  const inStockProducts = (products ?? [])
    .filter(isProductInStock)
    .slice(0, FEATURED_PRODUCT_COUNT)

  if (inStockProducts.length < FEATURED_PRODUCT_COUNT) return null

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <Heading level="h2" className="text-2xl-semi">
            Featured Products
          </Heading>
          <Text className="text-ui-fg-subtle mt-1">
            A hand-picked selection of our most popular tiles.
          </Text>
        </div>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-5 small:gap-6">
        {inStockProducts.map((product: HttpTypes.StoreProduct, i: number) => (
          <FeaturedProductCard
            key={product.id}
            product={product}
            tilt={i % 2 === 0 ? -1.5 : 1.5}
          />
        ))}
        <div className="relative overflow-hidden rounded-large bg-brand-primary p-6 flex flex-col justify-center gap-4">
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-brand-secondary/25 blur-2xl animate-orbit" />
          <Text className="text-white text-large-semi relative">
            Need help choosing?
          </Text>
          <div className="flex flex-col gap-2.5 relative">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-small-semi text-gray-900">
                  {i + 1}
                </span>
                <Text className="text-white/85 text-small-regular">
                  {step}
                </Text>
              </div>
            ))}
          </div>
          <LocalizedClientLink href="/store" className="relative w-fit">
            <span className="inline-flex items-center gap-2 text-small-semi text-brand-secondary hover:text-white transition-colors">
              Start browsing →
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
