import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { isProductInStock } from "@lib/util/is-product-in-stock"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/ui"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products
      .filter(
        (responseProduct) =>
          responseProduct.id !== product.id &&
          isProductInStock(responseProduct)
      )
      .slice(0, 4)
  })

  if (!products.length) {
    return null
  }

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-12">
        <span className="font-script text-[44px] leading-none text-brand-pink">
          You Might Also Like
        </span>
        <Heading
          level="h2"
          className="font-display font-normal text-brand-deep-plum text-[32px] small:text-[44px] leading-[1.08] mt-3"
        >
          More from the collection
        </Heading>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-5 small:gap-6">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
