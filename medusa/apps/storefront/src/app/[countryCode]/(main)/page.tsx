import { Metadata } from "next"

import HeroSlider from "@modules/home/components/hero-slider"
import WhyUs from "@modules/home/components/why-us"
import FeaturedProducts from "@modules/home/components/featured-products"
import Testimonials from "@modules/home/components/testimonials"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "TFO - Tile Factory Outlet",
  description:
    "Sydney's tile factory outlet - porcelain, ceramic, natural stone and mosaic tiles at factory direct prices.",
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
      <HeroSlider />
      <WhyUs />
      <FeaturedProducts region={region} />
      <Testimonials />
    </>
  )
}
