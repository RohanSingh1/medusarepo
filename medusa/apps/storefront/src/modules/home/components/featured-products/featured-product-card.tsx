import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"

const FeaturedProductCard = ({
  product,
  tilt,
}: {
  product: HttpTypes.StoreProduct
  tilt: number
}) => {
  const { cheapestPrice } = getProductPrice({ product })
  const image = product.thumbnail || product.images?.[0]?.url

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full overflow-hidden rounded-large bg-ui-bg-subtle shadow-elevation-card-rest transition-[rotate,transform,box-shadow] duration-300 ease-out hover:[rotate:0deg] hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-elevation-card-hover"
      style={{ rotate: `${tilt}deg` }}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 p-4">
        <Text className="text-base-semi truncate">{product.title}</Text>
        {cheapestPrice && (
          <Text className="text-small-regular text-ui-fg-subtle whitespace-nowrap">
            {cheapestPrice.calculated_price}
          </Text>
        )}
      </div>
    </LocalizedClientLink>
  )
}

export default FeaturedProductCard
