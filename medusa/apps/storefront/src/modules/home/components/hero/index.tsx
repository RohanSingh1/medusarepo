import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"
import { TESTIMONIALS } from "@modules/home/components/testimonials"

export default async function Hero({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products, count },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 20, fields: "metadata" },
  })

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
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length

  const stats = [
    ...(avgDays ? [{ value: String(avgDays), label: "Days per bottle" }] : []),
    { value: String(count), label: "Compositions" },
    {
      value: avgRating.toFixed(1),
      label: `From ${TESTIMONIALS.length} review${
        TESTIMONIALS.length === 1 ? "" : "s"
      }`,
    },
  ]

  return (
    <div className="content-container py-6 small:py-10">
      <div className="grid grid-cols-1 small:grid-cols-2 gap-5 small:gap-6 items-stretch">
        <div className="relative overflow-hidden rounded-[32px] bg-brand-purple p-8 small:p-14 flex flex-col justify-center">
          <div className="absolute -top-24 -right-16 h-[340px] w-[340px] rounded-full bg-brand-secondary/45 blur-3xl animate-orbit pointer-events-none" />
          <div className="relative flex flex-col gap-5">
            <span className="font-display text-large-semi text-brand-secondary">
              Fragrance, Engineered
            </span>
            <h1 className="font-display text-white text-3xl small:text-5xl font-medium leading-[1.05] tracking-tight">
              A Signature Scent
              <br />
              for Every Drive
            </h1>
            <p className="text-white/80 text-base small:text-large-regular max-w-md">
              Seven fragrances composed for the cabin. Hand-blended oils, a
              machined glass vessel, and a diffusion system tuned to the air
              of a moving car.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <LocalizedClientLink href="/store">
                <Button variant="primary" size="large">
                  Explore the Collection
                </Button>
              </LocalizedClientLink>
              <LocalizedClientLink href="/#experience">
                <Button
                  size="large"
                  className="bg-transparent text-white ring-1 ring-inset ring-white/60 hover:bg-white/10"
                >
                  Discover Your Scent
                </Button>
              </LocalizedClientLink>
            </div>

            <div className="flex gap-8 flex-wrap mt-2 pt-6 border-t border-white/20">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-medium text-white leading-none">
                    {stat.value}
                  </div>
                  <div className="text-small-regular text-white/70 mt-1.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative h-[280px] small:h-auto overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-dark via-brand-purple to-brand-dark">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-script text-white/20 text-[26vw] small:text-[11vw]">
              AURA
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
