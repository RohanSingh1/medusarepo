import { Car, Clock, Droplet, ShieldCheck, Sparkles, Wind } from "lucide-react"

import { Heading, Text } from "@modules/common/components/ui"

const REASONS = [
  {
    icon: Clock,
    title: "Long-Lasting Fragrance",
    description:
      "Up to 100 days from one bottle. Heavier base molecules survive cabin heat.",
  },
  {
    icon: Droplet,
    title: "Premium Ingredients",
    description: "Fine-fragrance oils, no alcohol carrier, IFRA compliant.",
  },
  {
    icon: Sparkles,
    title: "Elegant Design",
    description:
      "Machined cap, weighted glass, refillable body. Made to be seen on a console.",
  },
  {
    icon: ShieldCheck,
    title: "Easy Installation",
    description:
      "Three steps, under a minute, no tools. Fits horizontal and vertical vents.",
  },
  {
    icon: Wind,
    title: "Adjustable Intensity",
    description: "A three-position collar sets how much air reaches the wick.",
  },
  {
    icon: Car,
    title: "Made for Cars",
    description:
      "Tested from minus 10 to 60 degrees. Sealed against spill, stable in sunlight.",
  },
]

const WhyUs = () => {
  return (
    <div className="bg-brand-purple">
      <div className="content-container py-12 small:py-20">
        <div className="mb-12">
          <span className="font-display text-large-semi text-brand-secondary">
            Why AURA
          </span>
          <Heading
            level="h2"
            className="text-white text-2xl-semi small:text-3xl-semi mt-2"
          >
            Six reasons it is not an air freshener
          </Heading>
        </div>
        <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-6 gap-x-6 gap-y-10">
          {REASONS.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="relative text-center">
              {i < REASONS.length - 1 && (
                <div className="hidden small:block absolute top-7 left-[-50%] right-[-50%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              )}
              <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple ring-2 ring-white/60 ring-offset-4 ring-offset-brand-purple">
                <Icon size={22} strokeWidth={2} className="text-brand-secondary" />
              </div>
              <Text className="text-white text-base-semi">{title}</Text>
              <Text className="text-white/70 text-small-regular mt-1.5">
                {description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WhyUs
