import { Star } from "lucide-react"

import { Heading, Text } from "@modules/common/components/ui"

// Placeholder copy - swap in real customer reviews before launch.
const TESTIMONIALS = [
  {
    name: "Sarah M.",
    location: "Parramatta, NSW",
    quote:
      "Incredible range and the prices were much better than the big box stores. The team helped us pick the right anti-slip tile for our pool area.",
    rating: 5,
  },
  {
    name: "David K.",
    location: "Liverpool, NSW",
    quote:
      "Ordered a large format porcelain for our living area - arrived well packed and on time. Will be back for the bathroom reno.",
    rating: 5,
  },
  {
    name: "Priya R.",
    location: "Blacktown, NSW",
    quote:
      "Great advice over the phone about quantities and wastage. Saved us from over-ordering and the tiles look fantastic.",
    rating: 4,
  },
]

const Testimonials = () => {
  return (
    <div className="content-container py-12 small:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Heading level="h2" className="text-2xl-semi mb-2">
          What Our Customers Say
        </Heading>
        <Text className="text-ui-fg-subtle">
          Trusted by tradies and homeowners across Sydney.
        </Text>
      </div>
      <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
        {TESTIMONIALS.map(({ name, location, quote, rating }) => (
          <div
            key={name}
            className="flex flex-col gap-4 rounded-large border border-ui-border-base p-6 bg-ui-bg-subtle"
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-ui-border-base"
                  }
                />
              ))}
            </div>
            <Text className="text-ui-fg-subtle text-base-regular">
              "{quote}"
            </Text>
            <div>
              <Text className="text-base-semi">{name}</Text>
              <Text className="text-ui-fg-subtle text-small-regular">
                {location}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
