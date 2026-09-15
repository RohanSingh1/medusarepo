import { HttpTypes } from "@medusajs/types"

import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { isProductInStock } from "@lib/util/is-product-in-stock"
import { Heading, Text } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

const FEATURED_COLLECTION_HANDLE = "featured"

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
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    },
  })

  const inStockProducts = products?.filter(isProductInStock) ?? []

  if (!inStockProducts.length) {
    return null
  }

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
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-12 small:gap-y-24">
        {inStockProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
