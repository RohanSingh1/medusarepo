import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import Marquee from "@modules/home/components/marquee"
import Story from "@modules/home/components/story"
import Collection from "@modules/home/components/collection"
import InsideTheCar from "@modules/home/components/inside-the-car"
import WhyUs from "@modules/home/components/why-us"
import Testimonials from "@modules/home/components/testimonials"
import Journal from "@modules/home/components/journal"
import CtaBanner from "@modules/home/components/cta-banner"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "AURA - Fragrance for Every Drive",
  description:
    "Seven fragrances composed for the car cabin. Hand-blended oils, a machined glass vessel, and a diffusion system tuned to the air of a moving car.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero region={region} />
      <Marquee region={region} />
      <Story />
      <Collection region={region} />
      <InsideTheCar />
      <WhyUs />
      <Testimonials />
      <Journal />
      <CtaBanner />
    </>
  )
}
