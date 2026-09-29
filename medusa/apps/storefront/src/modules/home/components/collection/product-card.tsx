import Image from "next/image"

import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@lib/util/get-product-price"
import { getFragranceMeta } from "@lib/util/fragrance"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
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
      className="group block h-full overflow-hidden rounded-[16px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-[rotate,transform,box-shadow] duration-300 ease-out hover:[rotate:0deg] hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(59,26,51,0.10)]"
      style={{ rotate: `${tilt}deg` }}
    >
      {product.thumbnail ? (
        <div className="relative aspect-square w-full">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
        </div>
      ) : (
        <ScentBottle accent={accent} tint={tint} className="aspect-square w-full" />
      )}
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2">
          {/* Card title = a sub-heading, not a display headline - Inter Bold */}
          <p className="font-sans font-bold text-[22px] text-brand-deep-plum">
            {product.title}
          </p>
          {cheapestPrice && (
            <p className="font-sans font-semibold text-sm text-brand-deep-plum whitespace-nowrap">
              {cheapestPrice.calculated_price}
            </p>
          )}
        </div>
        <p className="text-sm text-brand-deep-plum/55 mt-1.5">{tagline}</p>
        <p className="text-sm font-semibold mt-4" style={{ color: accent }}>
          View fragrance
        </p>
      </div>
    </LocalizedClientLink>
  )
}

export default CollectionProductCard
