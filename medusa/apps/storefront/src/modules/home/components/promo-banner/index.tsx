import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

export default async function PromoBanner({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 1, order: "-created_at", fields: "thumbnail" },
  })

  const backgroundImage = products[0]?.thumbnail

  return (
    <div className="content-container py-12 small:py-16">
      <div className="relative overflow-hidden rounded-large bg-brand-primary">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/80 to-brand-primary/40" />
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-brand-secondary/30 blur-3xl animate-orbit" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-orbit-reverse" />

        <div className="relative px-8 py-12 small:px-16 small:py-20 flex flex-col items-center text-center gap-4">
          <Heading level="h2" className="text-white text-2xl-semi small:text-3xl-semi">
            Straight From the Factory, Straight to You
          </Heading>
          <Text className="text-white/90 max-w-xl">
            No middlemen, no markups - just premium porcelain, ceramic and
            natural stone tiles at outlet prices.
          </Text>
          <LocalizedClientLink href="/store">
            <Button variant="secondary" size="large" className="mt-2">
              Shop the Full Range
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
