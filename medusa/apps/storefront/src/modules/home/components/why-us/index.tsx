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
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

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
    <div className="bg-brand-primary">
      <div className="content-container py-12 small:py-20 grid grid-cols-1 small:grid-cols-2 gap-10 small:gap-16">
        <div className="flex flex-col justify-center gap-4">
          <Heading level="h2" className="text-white text-2xl-semi small:text-3xl-semi">
            Why Choose TFO?
          </Heading>
          <Text className="text-white/80">
            Sydney's tile factory outlet - real savings without compromising
            on range or quality.
          </Text>
          <LocalizedClientLink href="/store" className="w-fit mt-2">
            <Button variant="secondary">Shop Now</Button>
          </LocalizedClientLink>
        </div>
        <div className="flex flex-col gap-6">
          {items.map(({ id, icon, title, description }) => {
            const Icon = ICONS[icon as keyof typeof ICONS] ?? ShieldCheck
            return (
              <div key={id} className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-full bg-brand-secondary">
                  <Icon size={20} strokeWidth={2} className="text-gray-900" />
                </div>
                <div>
                  <Text className="text-white text-base-semi">{title}</Text>
                  <Text className="text-white/70 text-small-regular">
                    {description}
                  </Text>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WhyUs
