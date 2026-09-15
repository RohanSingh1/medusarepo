import { Metadata } from "next"

import HeroSlider from "@modules/home/components/hero-slider"
import WhyUs from "@modules/home/components/why-us"
import FeaturedProducts from "@modules/home/components/featured-products"
import LatestProducts from "@modules/home/components/latest-products"
import Testimonials from "@modules/home/components/testimonials"
import { getRegion } from "@lib/data/regions"
import { listHeroSlides } from "@lib/data/homepage-content"

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

  const heroSlides = await listHeroSlides()

  return (
    <>
      <HeroSlider slides={heroSlides} />
      <WhyUs />
      <FeaturedProducts region={region} />
      <LatestProducts region={region} />
      <Testimonials />
    </>
  )
}
