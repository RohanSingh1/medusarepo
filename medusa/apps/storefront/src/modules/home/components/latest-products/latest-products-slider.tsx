"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { HttpTypes } from "@medusajs/types"

import LatestProductCard from "./latest-product-card"

const LatestProductsSlider = ({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous products"
          className="flex items-center justify-center h-9 w-9 rounded-circle border border-ui-border-base text-ui-fg-base disabled:opacity-30 hover:bg-ui-bg-subtle transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next products"
          className="flex items-center justify-center h-9 w-9 rounded-circle border border-ui-border-base text-ui-fg-base disabled:opacity-30 hover:bg-ui-bg-subtle transition-colors"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="overflow-hidden -mx-6 px-6" ref={emblaRef}>
        <div className="flex gap-4 small:gap-6">
          {products.map((product) => (
            <LatestProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LatestProductsSlider
