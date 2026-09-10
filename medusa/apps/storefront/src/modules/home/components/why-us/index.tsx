import { Boxes, HandCoins, ShieldCheck, Truck } from "lucide-react"

import { Heading, Text } from "@modules/common/components/ui"

const REASONS = [
  {
    icon: HandCoins,
    title: "Lowest Outlet Prices",
    description:
      "Factory-direct buying power means genuine outlet prices on every tile, every day.",
  },
  {
    icon: Boxes,
    title: "Huge Range In Stock",
    description:
      "Hundreds of porcelain, ceramic, natural stone and mosaic ranges ready to ship.",
  },
  {
    icon: Truck,
    title: "Fast Sydney-Wide Delivery",
    description:
      "Order online and get your tiles delivered to your door or job site.",
  },
  {
    icon: ShieldCheck,
    title: "Expert Advice",
    description:
      "Our team can help you pick the right tile, finish and quantity for your project.",
  },
]

const WhyUs = () => {
  return (
    <div className="content-container py-12 small:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Heading level="h2" className="text-2xl-semi mb-2">
          Why Choose TFO?
        </Heading>
        <Text className="text-ui-fg-subtle">
          Sydney's tile factory outlet - real savings without compromising on
          range or quality.
        </Text>
      </div>
      <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-4 gap-8">
        {REASONS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-ui-bg-subtle">
              <Icon size={26} strokeWidth={1.5} />
            </div>
            <Text className="text-base-semi">{title}</Text>
            <Text className="text-ui-fg-subtle text-small-regular">
              {description}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhyUs
