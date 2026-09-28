import { Metadata } from "next"

import HeroSlider from "@modules/home/components/hero-slider"
import CategoryMarquee from "@modules/home/components/category-marquee"
import PriceLedCategories from "@modules/home/components/price-led-categories"
import CategoryShowcase from "@modules/home/components/category-showcase"
import WhyUs from "@modules/home/components/why-us"
import FeaturedProducts from "@modules/home/components/featured-products"
import PromoBanner from "@modules/home/components/promo-banner"
import LatestProducts from "@modules/home/components/latest-products"
import Testimonials from "@modules/home/components/testimonials"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import {
  listHeroSlides,
  listTestimonials,
} from "@lib/data/homepage-content"

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

  const [heroSlides, allCategories, testimonials, { response: catalog }] =
    await Promise.all([
      listHeroSlides(),
      listCategories({ limit: 100 }),
      listTestimonials(),
      listProducts({ regionId: region.id, queryParams: { limit: 1 } }),
    ])

  const topLevelCategoryCount = allCategories.filter(
    (c) => !c.parent_category_id
  ).length

  const avgRating = testimonials.length
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
    : null

  const roundedDown = (n: number, step: number) => {
    const floored = Math.floor(n / step) * step
    return floored > 0 ? `${floored}+` : `${n}`
  }

  const stats = [
    { value: roundedDown(catalog.count, 10), label: "Tiles in our range" },
    { value: roundedDown(topLevelCategoryCount, 5), label: "Categories to browse" },
    ...(avgRating
      ? [
          {
            value: avgRating.toFixed(1),
            label: `From ${testimonials.length} review${testimonials.length === 1 ? "" : "s"}`,
          },
        ]
      : []),
  ]

  return (
    <>
      <HeroSlider slides={heroSlides} stats={stats} />
      <CategoryMarquee />
      <PriceLedCategories region={region} />
      <CategoryShowcase />
      <WhyUs />
      <FeaturedProducts region={region} />
      <PromoBanner region={region} />
      <LatestProducts region={region} />
      <Testimonials />
    </>
  )
}
