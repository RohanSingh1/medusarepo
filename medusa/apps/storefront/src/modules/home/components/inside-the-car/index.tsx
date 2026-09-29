import Image from "next/image"

import { getHomepageContent, listInsideCarSteps } from "@lib/data/homepage-content"
import { Heading } from "@modules/common/components/ui"

export default async function InsideTheCar() {
  const [steps, content] = await Promise.all([
    listInsideCarSteps(),
    getHomepageContent(),
  ])

  return (
    <div className="bg-brand-sand">
      <div className="content-container py-12 small:py-24">
        <div className="mb-9">
          <span className="font-script text-[44px] leading-none text-brand-pink">
            Inside the Car
          </span>
          <Heading
            level="h2"
            className="font-display font-normal text-brand-deep-plum text-[32px] small:text-[52px] leading-[1.08] mt-3"
          >
            Where it lives
          </Heading>
        </div>
        <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
          <div className="relative rounded-[24px] overflow-hidden h-[670px] bg-gradient-to-br from-brand-plum via-brand-deep-plum to-brand-plum">
            {content.insideCarImageUrl && (
              <Image
                src={content.insideCarImageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-3 justify-center">
            {steps.map((step) => (
              <div
                key={step.id}
                className="p-6 rounded-[16px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
              >
                <div className="text-xs uppercase tracking-wide font-semibold text-brand-plum mb-2">
                  {step.stepNumber} — {step.title}
                </div>
                <p className="text-base text-brand-deep-plum/72">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
