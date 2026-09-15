import Image from "next/image"

import { getCategoryByHandle } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading, Text } from "@modules/common/components/ui"

// Hand-picked spread across material + room, not the full ~60-category tree -
// see the chat for reasoning. Falls back gracefully if a handle is renamed:
// entries with no matching category (or no products to source an image from)
// are simply skipped rather than breaking the section.
const CURATED_HANDLES = [
  "porcelain-tiles",
  "ceramic-tiles",
  "natural-stone-tiles",
  "mosaic-tiles",
  "outdoor-tiles",
  "bathroom-tiles",
  "floor-tiles",
  "wall-tiles",
]

export default async function CategoryShowcase() {
  const categories = await Promise.all(
    CURATED_HANDLES.map((handle) => getCategoryByHandle([handle]))
  )

  const tiles = categories
    .map((category) => ({
      category,
      image: category?.products?.[0]?.thumbnail,
    }))
    .filter(
      (t): t is { category: NonNullable<typeof t.category>; image: string } =>
        !!t.category && !!t.image
    )

  if (tiles.length < 4) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="mb-8">
        <Heading level="h2" className="text-2xl-semi">
          Shop by Category
        </Heading>
        <Text className="text-ui-fg-subtle mt-1">
          Find the right tile for every room and surface.
        </Text>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4 small:gap-6">
        {tiles.map(({ category, image }) => (
          <LocalizedClientLink
            key={category.id}
            href={`/categories/${category.handle}`}
            className="group relative block aspect-square overflow-hidden rounded-large bg-ui-bg-subtle"
          >
            <Image
              src={image}
              alt={category.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <Text className="text-white font-semibold text-base-semi">
                {category.name}
              </Text>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
