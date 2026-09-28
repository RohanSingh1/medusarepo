import { Heading, Text } from "@modules/common/components/ui"
import ScentBottle from "@modules/home/components/scent-bottle"

const TAGS = ["Blended in Grasse", "IFRA compliant", "Refillable vessel"]

export default function Story() {
  return (
    <div id="story" className="content-container py-12 small:py-24">
      <div className="grid grid-cols-1 small:grid-cols-2 gap-10 small:gap-20 items-center">
        <div>
          <span className="font-display text-large-semi text-brand-primary">
            Our Story
          </span>
          <Heading
            level="h2"
            className="text-2xl-semi small:text-3xl-semi mt-2 mb-5"
          >
            The cabin is the last room nobody designed a scent for.
          </Heading>
          <Text className="text-ui-fg-subtle mb-4">
            A car interior is a small, sealed, temperature-swinging space.
            Most air fresheners were built for it by accident. We started the
            other way round, with perfumers who usually work on fine
            fragrance, and asked what a composition needs to survive forty
            degrees of heat and a closed door.
          </Text>
          <Text className="text-ui-fg-subtle mb-6">
            The answer was heavier bases, fewer volatile tops, and a
            diffusion rate slow enough that you stop noticing it and start
            missing it when it is gone.
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
        <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-elevation-card-rest">
          <ScentBottle
            accent="#753666"
            tint="#F0EAE2"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}
