import { HttpTypes } from "@medusajs/types"

import FragranceProductCard from "@modules/common/components/fragrance-product-card"

export default function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region?: HttpTypes.StoreRegion
}) {
  return <FragranceProductCard product={product} />
}
