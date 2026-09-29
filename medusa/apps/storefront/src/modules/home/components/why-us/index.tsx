import { Car, Clock, Droplet, LucideIcon, ShieldCheck, Sparkles, Wind } from "lucide-react"

import { listWhyUsReasons } from "@lib/data/homepage-content"
import { Heading } from "@modules/common/components/ui"

const ICONS: Record<string, LucideIcon> = {
  Clock,
  Droplet,
  Sparkles,
  ShieldCheck,
  Wind,
  Car,
}

const WhyUs = async () => {
  const reasons = await listWhyUsReasons()

  return (
    <div className="bg-brand-plum">
      <div className="content-container py-12 small:py-20">
        <div className="mb-12">
          <span className="font-script text-[44px] leading-none text-brand-blush">
            Why AURA
          </span>
          <Heading
            level="h2"
            className="font-display font-normal text-white text-[32px] small:text-[52px] leading-[1.08] mt-3"
          >
            Six reasons it is not an air freshener
          </Heading>
        </div>
        <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-6 gap-x-6 gap-y-10">
          {reasons.map(({ id, icon, title, description }, i) => {
            const Icon = ICONS[icon] || Sparkles
            return (
              <div key={id} className="relative text-center">
                {i < reasons.length - 1 && (
                  <div className="hidden small:block absolute top-7 left-[-50%] right-[-50%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                )}
                <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-plum ring-2 ring-white/60 ring-offset-4 ring-offset-brand-plum">
                  <Icon size={22} strokeWidth={2} className="text-brand-blush" />
                </div>
                {/* Card-level titles are sub-headings, not display type - Inter SemiBold */}
                <p className="font-sans font-semibold text-white text-base">
                  {title}
                </p>
                <p className="text-sm text-white/70 mt-1.5">{description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WhyUs
