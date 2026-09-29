import { Star } from "lucide-react"

import { listTestimonials } from "@lib/data/homepage-content"
import { Heading } from "@modules/common/components/ui"

const Testimonials = async () => {
  const testimonials = await listTestimonials()
  const avgRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length

  return (
    <div className="content-container py-12 small:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="font-script text-[44px] leading-none text-brand-pink">
          In Their Words
        </span>
        <Heading
          level="h2"
          className="font-display font-normal text-brand-deep-plum text-[28px] small:text-[38px] leading-[1.08] mt-3"
        >
          {avgRating.toFixed(1)} average from {testimonials.length} drivers
        </Heading>
      </div>
      <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-4 gap-6 py-2">
        {testimonials.map(({ id, name, location, quote, rating }, i) => (
          <div
            key={id}
            className={`flex flex-col gap-4 rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-out hover:[rotate:0deg] hover:-translate-y-1.5 hover:scale-[1.02] ${
              i % 2 === 0 ? "bg-brand-sand" : "bg-brand-blush/60"
            }`}
            style={{ rotate: `${i % 2 === 0 ? -1 : 1}deg` }}
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  size={16}
                  className={
                    j < rating
                      ? "fill-brand-pink text-brand-pink"
                      : "text-brand-deep-plum/20"
                  }
                />
              ))}
            </div>
            <p className="text-base text-brand-deep-plum">&quot;{quote}&quot;</p>
            <div>
              <p className="font-sans font-semibold text-brand-deep-plum">
                {name}
              </p>
              <p className="text-sm text-brand-deep-plum/55">{location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
