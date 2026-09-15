import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import { isProductInStock } from "@lib/util/is-product-in-stock"
import { Heading, Text } from "@modules/common/components/ui"
import LatestProductsSlider from "./latest-products-slider"

const LATEST_PRODUCT_COUNT = 10

export default async function LatestProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: LATEST_PRODUCT_COUNT * 2,
      order: "-created_at",
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    },
  })

  const inStockProducts = (products ?? [])
    .filter(isProductInStock)
    .slice(0, LATEST_PRODUCT_COUNT)

  if (inStockProducts.length < 4) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="mb-8">
        <Heading level="h2" className="text-2xl-semi">
          New Arrivals
        </Heading>
        <Text className="text-ui-fg-subtle mt-1">
          The latest tiles to land in our warehouse.
        </Text>
      </div>
      <LatestProductsSlider products={inStockProducts} />
    </div>
  )
}
