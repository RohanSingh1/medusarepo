"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Slide = {
  image: string
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
}

const SLIDES: Slide[] = [
  {
    image:
      "https://staging.tfo.com.au/wp-content/uploads/1970/01/5711.jpg",
    eyebrow: "Outdoor & Pool Tiles",
    title: "Outdoor Tiles Built to Last",
    subtitle:
      "Anti-slip porcelain for alfresco areas, balconies and pool surrounds.",
    ctaLabel: "Shop Outdoor Tiles",
    ctaHref: "/store",
  },
  {
    image:
      "https://staging.tfo.com.au/wp-content/uploads/Arezzo-Perla-Glazed-Matt-Spanish-Porcelain-Tile-1.jpg",
    eyebrow: "Large Format Porcelain",
    title: "Factory Direct Prices, Every Day",
    subtitle:
      "Skip the middleman. The same premium tiles, at Sydney's lowest outlet prices.",
    ctaLabel: "Shop All Tiles",
    ctaHref: "/store",
  },
  {
    image:
      "https://staging.tfo.com.au/wp-content/uploads/pearl-blue-silicone-joined-spanish-pool-mosaic-tile-1.jpg",
    eyebrow: "Pool Mosaics",
    title: "Transform Your Pool",
    subtitle:
      "Spanish glass mosaics designed for pool floors and waterlines.",
    ctaLabel: "Shop Pool Mosaics",
    ctaHref: "/store",
  },
  {
    image:
      "https://staging.tfo.com.au/wp-content/uploads/bianco-carrara-arabesque-polished-marble-mosaic-sheet-1.jpg",
    eyebrow: "Natural Stone",
    title: "Marble & Natural Stone",
    subtitle:
      "Bring timeless texture to bathrooms, splashbacks and feature walls.",
    ctaLabel: "Shop Natural Stone",
    ctaHref: "/store",
  },
]

const AUTOPLAY_INTERVAL_MS = 6000

const HeroSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <div className="relative w-full h-[60vh] small:h-[75vh] overflow-hidden border-b border-ui-border-base">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] h-full"
              aria-hidden={selectedIndex !== index}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="content-container relative z-10 h-full flex flex-col justify-center items-start gap-4 text-left">
                <span className="text-white/80 text-small-semi uppercase tracking-wider">
                  {slide.eyebrow}
                </span>
                <h1 className="text-white text-3xl small:text-5xl font-semibold max-w-xl leading-tight">
                  {slide.title}
                </h1>
                <p className="text-white/90 text-base small:text-large-regular max-w-md">
                  {slide.subtitle}
                </p>
                <LocalizedClientLink href={slide.ctaHref}>
                  <Button size="large" className="mt-2">
                    {slide.ctaLabel}
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              selectedIndex === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
