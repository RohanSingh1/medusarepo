import { HttpTypes } from "@medusajs/types"

import { getFragranceMeta } from "@lib/util/fragrance"
import { Heading } from "@modules/common/components/ui"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { mood } = getFragranceMeta(product)

  return (
    <div id="product-info" className="flex flex-col gap-y-4">
      <span className="font-script text-[44px] leading-none text-brand-pink">
        {mood || product.collection?.title || "AURA Fragrance"}
      </span>
      <Heading
        level="h1"
        className="font-display font-normal text-brand-deep-plum text-[40px] small:text-[52px] leading-[1.05]"
        data-testid="product-title"
      >
        {product.title}
      </Heading>

      {product.description && (
        <p
          className="text-lg text-brand-deep-plum/72 whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}

      {((product.categories && product.categories.length > 0) ||
        (product.tags && product.tags.length > 0)) && (
        <div className="flex flex-col gap-1.5 mt-2 text-sm text-brand-deep-plum/55">
          {product.categories && product.categories.length > 0 && (
            <div>
              <span className="uppercase tracking-wide font-semibold text-brand-deep-plum/40 mr-2">
                Categories:
              </span>
              {product.categories.map((c) => c.name).join(", ")}
            </div>
          )}
          {product.tags && product.tags.length > 0 && (
            <div>
              <span className="uppercase tracking-wide font-semibold text-brand-deep-plum/40 mr-2">
                Tags:
              </span>
              {product.tags.map((t) => t.value).join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductInfo
