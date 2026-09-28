import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import { Heading, Text } from "@modules/common/components/ui"

const TAGS = ["Factory Direct", "No Middlemen", "Sydney Based"]

export default async function Story({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 1, fields: "thumbnail" },
  })

  const image = products[0]?.thumbnail
  if (!image) return null

  return (
    <div className="content-container py-12 small:py-24">
      <div className="grid grid-cols-1 small:grid-cols-2 gap-10 small:gap-20 items-center">
        <div>
          <div className="font-display text-large-semi text-brand-primary">Our story</div>
          <Heading level="h2" className="text-2xl-semi small:text-3xl-semi mt-2 mb-5">
            Tiles built for trade prices, not showroom markups.
          </Heading>
          <Text className="text-ui-fg-subtle mb-4">
            Most tile retailers buy through a chain of importers and
            distributors before a tile ever reaches a showroom floor - and
            every link in that chain adds its own margin. We buy directly
            from manufacturers and pass the saving straight through.
          </Text>
          <Text className="text-ui-fg-subtle mb-6">
            That means the same porcelain, ceramic and natural stone ranges
            other stores carry, at outlet pricing - without cutting corners
            on range, quality or support.
          </Text>
          <div className="flex gap-2.5 flex-wrap">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="px-5 py-3 rounded-full bg-brand-cream text-small-semi text-brand-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-ui-bg-subtle shadow-elevation-card-rest">
          <Image
            src={image}
            alt="Tile Factory Outlet range"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
