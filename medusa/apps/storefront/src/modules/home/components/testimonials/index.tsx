import { Star } from "lucide-react"

import { listTestimonials } from "@lib/data/homepage-content"
import { Heading, Text } from "@modules/common/components/ui"

const Testimonials = async () => {
  const testimonials = await listTestimonials()

  if (!testimonials.length) {
    return null
  }

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
        {testimonials.map(({ id, name, location, quote, rating }) => (
          <div
            key={id}
            className="flex flex-col gap-4 rounded-large border-t-4 border-brand-primary bg-ui-bg-subtle p-6 shadow-elevation-card-rest"
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
              {location && (
                <Text className="text-ui-fg-subtle text-small-regular">
                  {location}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
