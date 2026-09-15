import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"

const FeaturedProductCard = ({
  product,
  size = "small",
}: {
  product: HttpTypes.StoreProduct
  size?: "large" | "small"
}) => {
  const { cheapestPrice } = getProductPrice({ product })
  const image = product.thumbnail || product.images?.[0]?.url

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group relative block w-full h-full overflow-hidden rounded-large bg-ui-bg-subtle"
    >
      {image && (
        <Image
          src={image}
          alt={product.title}
          fill
          sizes={
            size === "large"
              ? "(max-width: 1024px) 100vw, 50vw"
              : "(max-width: 1024px) 50vw, 25vw"
          }
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 small:p-6 ${
          size === "large" ? "small:gap-2" : ""
        }`}
      >
        <Text
          className={`text-white font-semibold leading-tight ${
            size === "large" ? "text-large-semi small:text-2xl-semi" : "text-base-semi"
          }`}
        >
          {product.title}
        </Text>
        {cheapestPrice && (
          <Text className="text-white/80 text-small-regular">
            {cheapestPrice.calculated_price}
          </Text>
        )}
      </div>
    </LocalizedClientLink>
  )
}

export default FeaturedProductCard
