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
      <div className="content-container py-12 small:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <Heading level="h2" className="text-white text-2xl-semi small:text-3xl-semi">
              Why Choose TFO?
            </Heading>
            <Text className="text-white/80 mt-1">
              Sydney's tile factory outlet - real savings without
              compromising on range or quality.
            </Text>
          </div>
          <LocalizedClientLink href="/store" className="w-fit">
            <Button variant="secondary">Shop Now</Button>
          </LocalizedClientLink>
        </div>
        <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-6 gap-x-6 gap-y-10">
          {items.map(({ id, icon, title, description }, i) => {
            const Icon = ICONS[icon as keyof typeof ICONS] ?? ShieldCheck
            return (
              <div key={id} className="relative text-center">
                {i < items.length - 1 && (
                  <div className="hidden small:block absolute top-7 left-[-50%] right-[-50%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                )}
                <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary ring-2 ring-white/50 ring-offset-4 ring-offset-brand-primary">
                  <Icon size={22} strokeWidth={2} className="text-brand-secondary" />
                </div>
                <Text className="text-white text-base-semi">{title}</Text>
                <Text className="text-white/70 text-small-regular mt-1.5">
                  {description}
                </Text>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WhyUs
