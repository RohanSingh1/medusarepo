import { Star } from "lucide-react"

import { Heading, Text } from "@modules/common/components/ui"

export const TESTIMONIALS = [
  {
    name: "Daniel R.",
    location: "Noir, verified buyer",
    quote:
      "I have had three cars detailed by the same studio and none of them smelled like this. Noir lasted the full quarter in a Range Rover.",
    rating: 5,
  },
  {
    name: "Priya S.",
    location: "Aqua, verified buyer",
    quote:
      "Bought Aqua for a weekend car that always smelled closed up. It is the first thing passengers mention now.",
    rating: 5,
  },
  {
    name: "Marcus T.",
    location: "Oud, verified buyer",
    quote:
      "The price made me hesitate. Three months later the bottle is still going and the cabin still smells composed, not sprayed.",
    rating: 5,
  },
  {
    name: "Elena K.",
    location: "Velvet, verified buyer",
    quote:
      "Install took under a minute and the vent clip does not rattle, which was my main worry.",
    rating: 5,
  },
] as const

const Testimonials = () => {
  const avgRating =
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length

  return (
    <div className="content-container py-12 small:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="font-display text-large-semi text-brand-primary">
          In Their Words
        </span>
        <Heading level="h2" className="text-2xl-semi small:text-3xl-semi mt-2">
          {avgRating.toFixed(1)} average from {TESTIMONIALS.length} drivers
        </Heading>
      </div>
      <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-4 gap-6 py-2">
        {TESTIMONIALS.map(({ name, location, quote, rating }, i) => (
          <div
            key={name}
            className={`flex flex-col gap-4 rounded-large p-6 shadow-elevation-card-rest transition-transform duration-300 ease-out hover:[rotate:0deg] hover:-translate-y-1.5 hover:scale-[1.02] ${
              i % 2 === 0 ? "bg-brand-cream" : "bg-brand-secondary/60"
            }`}
            style={{ rotate: `${i % 2 === 0 ? -1 : 1}deg` }}
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  size={16}
                  className={
                    j < rating
                      ? "fill-brand-primary text-brand-primary"
                      : "text-ui-border-base"
                  }
                />
              ))}
            </div>
            <Text className="font-display text-ui-fg-base text-base-regular">
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
