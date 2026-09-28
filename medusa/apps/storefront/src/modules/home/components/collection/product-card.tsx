import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@lib/util/get-product-price"
import { getFragranceMeta } from "@lib/util/fragrance"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"
import ScentBottle from "@modules/home/components/scent-bottle"

const CollectionProductCard = ({
  product,
  tilt,
}: {
  product: HttpTypes.StoreProduct
  tilt: number
}) => {
  const { cheapestPrice } = getProductPrice({ product })
  const { accent, tint, tagline } = getFragranceMeta(product)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full overflow-hidden rounded-large bg-white shadow-elevation-card-rest transition-[rotate,transform,box-shadow] duration-300 ease-out hover:[rotate:0deg] hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-elevation-card-hover"
      style={{ rotate: `${tilt}deg` }}
    >
      <ScentBottle accent={accent} tint={tint} className="aspect-square w-full" />
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2">
          <Text className="font-display text-2xl-semi text-ui-fg-base">
            {product.title}
          </Text>
          {cheapestPrice && (
            <Text className="text-small-semi text-ui-fg-base whitespace-nowrap">
              {cheapestPrice.calculated_price}
            </Text>
          )}
        </div>
        <Text className="text-small-regular text-ui-fg-subtle mt-1.5">
          {tagline}
        </Text>
        <Text className="text-small-semi mt-4" style={{ color: accent }}>
          View fragrance
        </Text>
      </div>
    </LocalizedClientLink>
  )
}

export default CollectionProductCard
