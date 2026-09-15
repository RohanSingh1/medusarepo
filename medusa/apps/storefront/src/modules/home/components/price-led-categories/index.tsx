import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

type VariantWithPrice = HttpTypes.StoreProductVariant & {
  calculated_price?: { calculated_amount: number }
}

// Cheapest-price-per-category rows. "From $X" is computed live from real
// variant prices (not a marketing stat), so it can't go stale or misrepresent
// the range - see the chat for why this section stops short of the fuller
// reference design (showroom/certifications/etc. need real content first).
const ROWS: { handle: string; label: string; description: string }[] = [
  {
    handle: "floor-tiles",
    label: "Floor Tiles",
    description:
      "Durable, low-maintenance floor tiles for every room - from porcelain to natural stone looks, ready for high-traffic areas.",
  },
  {
    handle: "bathroom-tiles",
    label: "Bathroom Tiles",
    description:
      "Water-resistant wall and floor tiles designed for wet areas, in a full range of finishes and sizes.",
  },
  {
    handle: "natural-stone-tiles",
    label: "Natural Stone",
    description:
      "Genuine marble, travertine, limestone and granite tiles for a timeless, one-of-a-kind finish.",
  },
]

async function getRowData(
  row: (typeof ROWS)[number],
  region: HttpTypes.StoreRegion
) {
  const category = await getCategoryByHandle([row.handle])
  if (!category) return null

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      category_id: category.id,
      limit: 100,
      fields: "thumbnail,*variants.calculated_price",
    },
  })

  const image = category.products?.[0]?.thumbnail ?? products[0]?.thumbnail
  if (!image) return null

  const prices = products
    .flatMap((p) => (p.variants ?? []) as VariantWithPrice[])
    .map((v) => v.calculated_price?.calculated_amount)
    .filter((amount): amount is number => typeof amount === "number")

  if (!prices.length) return null

  const cheapest = Math.min(...prices)
  const currencyCode = region.currency_code

  return {
    ...row,
    categoryHandle: category.handle,
    image,
    fromPrice: convertToLocale({
      amount: cheapest,
      currency_code: currencyCode,
      maximumFractionDigits: 0,
    }),
  }
}

export default async function PriceLedCategories({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const rows = (await Promise.all(ROWS.map((row) => getRowData(row, region))))
    .filter((r): r is NonNullable<typeof r> => !!r)

  if (!rows.length) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24 flex flex-col gap-12 small:gap-16">
      {rows.map((row, index) => (
        <div
          key={row.handle}
          className={`flex flex-col small:flex-row items-center gap-6 small:gap-12 ${
            index % 2 === 1 ? "small:flex-row-reverse" : ""
          }`}
        >
          <div className="relative w-full small:w-1/2 aspect-[4/3] rounded-large overflow-hidden bg-ui-bg-subtle">
            <Image
              src={row.image}
              alt={row.label}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="w-full small:w-1/2 flex flex-col gap-3">
            <Heading level="h2" className="text-2xl-semi">
              {row.label} from {row.fromPrice}/m²
            </Heading>
            <Text className="text-ui-fg-subtle">{row.description}</Text>
            <LocalizedClientLink
              href={`/categories/${row.categoryHandle}`}
              className="mt-2 w-fit"
            >
              <Button variant="primary">Shop {row.label}</Button>
            </LocalizedClientLink>
          </div>
        </div>
      ))}
    </div>
  )
}
