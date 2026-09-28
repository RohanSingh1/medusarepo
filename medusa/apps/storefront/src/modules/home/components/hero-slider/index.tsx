"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HeroSlide } from "@lib/data/homepage-content"

const AUTOPLAY_INTERVAL_MS = 6000

export type HeroStat = { value: string; label: string }

const HeroSlider = ({
  slides,
  stats,
}: {
  slides: HeroSlide[]
  stats?: HeroStat[]
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [imageEmblaRef, imageEmblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi || !imageEmblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    emblaApi.on("select", () => imageEmblaApi.scrollTo(emblaApi.selectedScrollSnap()))
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, imageEmblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [emblaApi, selectedIndex])

  if (!slides.length) {
    return null
  }

  return (
    <div className="content-container py-6 small:py-10">
      <div className="relative grid grid-cols-1 small:grid-cols-2 rounded-large overflow-hidden bg-ui-bg-subtle border border-ui-border-base">
        {/* Text panel */}
        <div className="order-2 small:order-1 flex flex-col justify-center gap-5 p-8 small:p-14">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide) => (
                <div key={slide.id} className="flex-[0_0_100%] flex flex-col gap-4">
                  {slide.eyebrow && (
                    <span className="inline-flex w-fit items-center rounded-full bg-brand-secondary/20 px-3 py-1 text-small-semi uppercase tracking-wider text-brand-primary">
                      {slide.eyebrow}
                    </span>
                  )}
                  <h1 className="text-ui-fg-base text-3xl small:text-4xl font-semibold leading-tight">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-ui-fg-subtle text-base small:text-large-regular max-w-md">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.ctaLabel && slide.ctaHref && (
                    <LocalizedClientLink href={slide.ctaHref}>
                      <Button size="large" className="mt-2 w-fit">
                        {slide.ctaLabel}
                      </Button>
                    </LocalizedClientLink>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="flex items-center justify-center h-10 w-10 rounded-base border border-ui-border-base text-ui-fg-base hover:bg-ui-bg-base-hover transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next slide"
              className="flex items-center justify-center h-10 w-10 rounded-base border border-ui-border-base text-ui-fg-base hover:bg-ui-bg-base-hover transition-colors"
            >
              <ArrowRight size={18} />
            </button>

            <span className="text-ui-fg-muted text-small-regular ml-1 tabular-nums">
              {String(selectedIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>

            <div className="flex-1 h-1 rounded-full bg-ui-bg-base overflow-hidden max-w-[140px]">
              <div
                key={selectedIndex}
                className="h-full bg-brand-primary rounded-full animate-hero-progress"
                style={{ animationDuration: `${AUTOPLAY_INTERVAL_MS}ms` }}
              />
            </div>
          </div>

          {stats && stats.length > 0 && (
            <div className="flex gap-8 flex-wrap mt-6 pt-6 border-t border-ui-border-base">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-semibold text-ui-fg-base leading-none">
                    {stat.value}
                  </div>
                  <div className="text-small-regular text-ui-fg-subtle mt-1.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image panel */}
        <div className="order-1 small:order-2 relative h-[280px] small:h-[520px] overflow-hidden" ref={imageEmblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div key={slide.id} className="relative flex-[0_0_100%] h-full">
                {slide.imageUrl && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.imageUrl})` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSlider
