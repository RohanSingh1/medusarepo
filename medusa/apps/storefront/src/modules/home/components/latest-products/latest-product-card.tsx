import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Text } from "@modules/common/components/ui"

const LatestProductCard = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex-[0_0_70%] xsmall:flex-[0_0_45%] small:flex-[0_0_30%] medium:flex-[0_0_23%]"
    >
      <div className="relative">
        <span className="absolute top-3 left-3 z-10 rounded-full bg-ui-bg-base px-3 py-1 text-small-semi text-ui-fg-base shadow-sm">
          New
        </span>
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <Text className="text-ui-fg-base txt-compact-medium-plus line-clamp-2">
          {product.title}
        </Text>
      </div>
      {cheapestPrice && (
        <Text className="text-ui-fg-subtle txt-compact-medium mt-1">
          {cheapestPrice.calculated_price}
        </Text>
      )}
    </LocalizedClientLink>
  )
}

export default LatestProductCard
