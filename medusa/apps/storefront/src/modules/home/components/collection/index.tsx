import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import { getHomepageContent } from "@lib/data/homepage-content"
import { isProductInStock } from "@lib/util/is-product-in-stock"
import { Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CollectionProductCard from "./product-card"

export default async function Collection({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const [
    {
      response: { products },
    },
    content,
  ] = await Promise.all([
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 20,
        fields:
          "title,handle,thumbnail,metadata,*variants.calculated_price,+variants.inventory_quantity",
      },
    }),
    getHomepageContent(),
  ])

  const inStock = products.filter(isProductInStock)
  if (!inStock.length) return null

  return (
    <div id="collection" className="content-container py-12 small:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <span className="font-script text-[44px] leading-none text-brand-pink">
            {content.collectionEyebrow}
          </span>
          <Heading
            level="h2"
            className="font-display font-normal text-brand-deep-plum text-[32px] small:text-[52px] leading-[1.08] mt-3"
          >
            {content.collectionHeadline}
          </Heading>
        </div>
        <p className="text-lg text-brand-deep-plum/72 max-w-sm">
          {content.collectionIntro}
        </p>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-5 small:gap-6">
        {inStock.map((product: HttpTypes.StoreProduct, i: number) => (
          <CollectionProductCard
            key={product.id}
            product={product}
            tilt={i % 2 === 0 ? -1.5 : 1.5}
          />
        ))}
        <div className="relative overflow-hidden rounded-[16px] bg-brand-deep-plum p-6 flex flex-col justify-center gap-4">
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-brand-coral/40 blur-2xl animate-orbit" />
          <span className="relative w-fit inline-flex items-center rounded-full bg-brand-blush/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blush">
            Scent Finder
          </span>
          <p className="font-display font-normal text-white text-2xl relative">
            {content.collectionFinderHeading}
          </p>
          <div className="flex flex-col gap-2.5 relative">
            {content.collectionFinderQuestions.map((q, i) => (
              <div key={q} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blush/20 text-sm font-bold text-brand-blush">
                  {i + 1}
                </span>
                <span className="text-white/85 text-sm">{q}</span>
              </div>
            ))}
          </div>
          <LocalizedClientLink href="/store" className="relative w-fit">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-pink hover:text-white transition-colors">
              {content.collectionFinderCtaLabel}
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
