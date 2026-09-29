import Image from "next/image"

import { getHomepageContent } from "@lib/data/homepage-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading } from "@modules/common/components/ui"

export default async function CtaBanner() {
  const content = await getHomepageContent()

  return (
    <div className="content-container pb-12 small:pb-24">
      <div className="relative rounded-[32px] overflow-hidden bg-brand-deep-plum min-h-[420px]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-plum/60 via-brand-deep-plum to-brand-deep-plum" />

        <div className="relative grid grid-cols-1 small:grid-cols-2 h-full pointer-events-none">
          <div className="relative min-h-[220px] small:min-h-[420px]">
            {content.ctaBannerImageUrl && (
              <Image
                src={content.ctaBannerImageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>

          <div className="relative overflow-hidden bg-brand-deep-plum p-8 small:p-16 flex flex-col justify-center pointer-events-auto">
            <div className="absolute -top-[18%] -right-[12%] h-[300px] w-[300px] rounded-full bg-brand-pink/60 blur-2xl animate-orbit pointer-events-none" />
            <div className="absolute -bottom-[22%] -left-[10%] h-[260px] w-[260px] rounded-full bg-brand-coral/50 blur-2xl animate-orbit-reverse pointer-events-none" />

            <Heading
              level="h2"
              className="relative font-display font-normal text-white text-[32px] small:text-[52px] leading-[1.08] mb-4"
            >
              {content.ctaBannerHeadline}
            </Heading>
            <p className="relative text-lg text-white/80 mb-7">
              {content.ctaBannerBody}
            </p>
            <LocalizedClientLink href={content.ctaBannerButtonHref} className="relative w-fit">
              <Button variant="primary" size="large">
                {content.ctaBannerButtonLabel}
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
