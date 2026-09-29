import Image from "next/image"

import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import { getHomepageContent, listTestimonials } from "@lib/data/homepage-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"

export default async function Hero({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const [
    {
      response: { products, count },
    },
    content,
    testimonials,
  ] = await Promise.all([
    listProducts({
      regionId: region.id,
      queryParams: { limit: 20, fields: "metadata" },
    }),
    getHomepageContent(),
    listTestimonials(),
  ])

  const lastsDays = products
    .map((p) => {
      const match = /(\d+)\s*days/.exec(
        typeof p.metadata?.lasts === "string" ? p.metadata.lasts : ""
      )
      return match ? Number(match[1]) : null
    })
    .filter((n): n is number => n !== null)

  const avgDays = lastsDays.length
    ? Math.round(lastsDays.reduce((a, b) => a + b, 0) / lastsDays.length)
    : null

  const avgRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length

  const stats = [
    ...(avgDays ? [{ value: String(avgDays), label: "Days per bottle" }] : []),
    { value: String(count), label: "Compositions" },
    {
      value: avgRating.toFixed(1),
      label: `From ${testimonials.length} review${
        testimonials.length === 1 ? "" : "s"
      }`,
    },
  ]

  return (
    <div className="content-container py-6 small:py-10">
      <div className="grid grid-cols-1 small:grid-cols-2 gap-5 small:gap-6 items-stretch">
        <div className="relative overflow-hidden rounded-[32px] bg-brand-plum p-8 small:p-14 flex flex-col justify-center">
          <div className="absolute -top-24 -right-16 h-[340px] w-[340px] rounded-full bg-brand-blush/45 blur-3xl animate-orbit pointer-events-none" />
          <div className="relative flex flex-col gap-5">
            <span className="font-script text-[44px] leading-none text-brand-blush">
              {content.heroEyebrow}
            </span>
            <h1 className="font-display font-normal text-white text-[56px] small:text-[96px] leading-[1.02] tracking-tight">
              {content.heroHeadlineLine1}
              {content.heroHeadlineLine2 && (
                <>
                  <br />
                  {content.heroHeadlineLine2}
                </>
              )}
            </h1>
            <p className="text-lg text-white/85 max-w-md">
              {content.heroSubcopy}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <LocalizedClientLink href={content.heroPrimaryCtaHref}>
                <Button variant="primary" size="large">
                  {content.heroPrimaryCtaLabel}
                </Button>
              </LocalizedClientLink>
            </div>

            <div className="flex gap-8 flex-wrap mt-2 pt-6 border-t border-white/20">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-normal text-3xl text-white leading-none">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 mt-1.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative h-[280px] small:h-auto overflow-hidden rounded-[32px] bg-brand-sand">
          {content.heroImageUrl ? (
            <Image
              src={content.heroImageUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            // Real photography goes here once it's uploaded in Strapi
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-script text-brand-plum/15 text-[26vw] small:text-[11vw]">
                AURA
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
