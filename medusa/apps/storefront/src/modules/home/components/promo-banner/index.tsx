import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

export default function PromoBanner() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="rounded-large bg-brand-primary px-8 py-12 small:px-16 small:py-16 flex flex-col items-center text-center gap-4">
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
  )
}
