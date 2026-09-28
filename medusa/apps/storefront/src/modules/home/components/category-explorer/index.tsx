import { HttpTypes } from "@medusajs/types"

import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { Heading, Text } from "@modules/common/components/ui"
import CategoryExplorerTabs, { ExplorerEntry } from "./tabs"

type VariantWithPrice = HttpTypes.StoreProductVariant & {
  calculated_price?: { calculated_amount: number; currency_code: string }
}

const HANDLES = [
  "porcelain-tiles",
  "ceramic-tiles",
  "natural-stone-tiles",
  "mosaic-tiles",
  "outdoor-tiles",
  "bathroom-tiles",
]

async function getEntry(
  handle: string,
  region: HttpTypes.StoreRegion
): Promise<ExplorerEntry | null> {
  const category = await getCategoryByHandle([handle])
  if (!category) return null

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      category_id: category.id,
      limit: 1,
      fields: "title,handle,thumbnail,material,length,width,height,origin_country,*variants.calculated_price",
    },
  })

  const product = products[0]
  const image = product?.thumbnail
  if (!product || !image) return null

  const variants = (product.variants ?? []) as VariantWithPrice[]
  const cheapestVariant = variants
    .filter((v) => !!v.calculated_price)
    .sort(
      (a, b) =>
        (a.calculated_price?.calculated_amount ?? 0) -
        (b.calculated_price?.calculated_amount ?? 0)
    )[0]
  const cheapest = cheapestVariant?.calculated_price?.calculated_amount
  const currency = cheapestVariant?.calculated_price?.currency_code

  return {
    handle: category.handle,
    label: category.name,
    productTitle: product.title,
    productHandle: product.handle!,
    image,
    material: product.material ?? null,
    dimensions:
      product.length && product.width
        ? `${product.length} x ${product.width}${
            product.height ? ` x ${product.height}` : ""
          } cm`
        : null,
    origin: product.origin_country ?? null,
    price:
      cheapest && currency
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
          }).format(cheapest)
        : null,
  }
}

export default async function CategoryExplorer({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const entries = (
    await Promise.all(HANDLES.map((h) => getEntry(h, region)))
  ).filter((e): e is ExplorerEntry => !!e)

  if (entries.length < 3) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="font-display text-large-semi text-brand-primary">
          Explore the range
        </div>
        <Heading level="h2" className="text-2xl-semi small:text-3xl-semi mt-2 mb-3">
          Find the right tile for the job
        </Heading>
        <Text className="text-ui-fg-subtle">
          Pick a category to see a real example from our range, with its
          material, size and price.
        </Text>
      </div>
      <CategoryExplorerTabs entries={entries} />
    </div>
  )
}
