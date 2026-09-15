import { HttpTypes } from "@medusajs/types"

import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { isProductInStock } from "@lib/util/is-product-in-stock"
import { Heading, Text } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import FeaturedProductCard from "./featured-product-card"

const FEATURED_COLLECTION_HANDLE = "featured"
const FEATURED_PRODUCT_COUNT = 4

export default async function FeaturedProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const collection = await getCollectionByHandle(FEATURED_COLLECTION_HANDLE)

  if (!collection) {
    return null
  }

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      limit: FEATURED_PRODUCT_COUNT * 3,
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    },
  })

  const inStockProducts = (products ?? [])
    .filter(isProductInStock)
    .slice(0, FEATURED_PRODUCT_COUNT)

  if (inStockProducts.length < FEATURED_PRODUCT_COUNT) {
    return null
  }

  const [hero, ...rest] = inStockProducts

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
      <div className="grid grid-cols-1 small:grid-cols-2 gap-4 small:gap-6 h-auto small:h-[640px]">
        <div className="h-[320px] small:h-full">
          <FeaturedProductCard product={hero} size="large" />
        </div>
        <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-1 gap-4 small:gap-6 h-auto small:h-full">
          {rest.map((product) => (
            <div key={product.id} className="h-[220px] small:h-auto">
              <FeaturedProductCard product={product} size="small" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
