import {
  Award,
  Boxes,
  Clock,
  HandCoins,
  Headset,
  Leaf,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react"

import { listWhyUsItems } from "@lib/data/homepage-content"
import { Heading, Text } from "@modules/common/components/ui"

// Keys must match the "icon" enum values configured on the Why Us Item
// content type in Strapi.
const ICONS = {
  HandCoins,
  Boxes,
  Truck,
  ShieldCheck,
  Star,
  Award,
  Clock,
  Headset,
  Leaf,
  MapPin,
} as const

const WhyUs = async () => {
  const items = await listWhyUsItems()

  if (!items.length) {
    return null
  }

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
        {items.map(({ id, icon, title, description }) => {
          const Icon = ICONS[icon as keyof typeof ICONS] ?? ShieldCheck
          return (
            <div key={id} className="flex flex-col items-center text-center gap-3">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-ui-bg-subtle">
                <Icon size={26} strokeWidth={1.5} />
              </div>
              <Text className="text-base-semi">{title}</Text>
              <Text className="text-ui-fg-subtle text-small-regular">
                {description}
              </Text>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WhyUs
