import Image from "next/image"

import { getHomepageContent } from "@lib/data/homepage-content"
import { Heading } from "@modules/common/components/ui"
import ScentBottle from "@modules/home/components/scent-bottle"

export default async function Story() {
  const content = await getHomepageContent()

  return (
    <div id="story" className="content-container py-12 small:py-24">
      <div className="grid grid-cols-1 small:grid-cols-2 gap-10 small:gap-20 items-center">
        <div>
          <span className="font-script text-[44px] leading-none text-brand-pink">
            {content.storyEyebrow}
          </span>
          <Heading
            level="h2"
            className="font-display font-normal text-brand-deep-plum text-[32px] small:text-[52px] leading-[1.08] mt-3 mb-5"
          >
            {content.storyHeadline}
          </Heading>
          <p className="text-lg text-brand-deep-plum/72 mb-4">
            {content.storyBody1}
          </p>
          <p className="text-lg text-brand-deep-plum/72 mb-6">
            {content.storyBody2}
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {content.storyTags.map((tag) => (
              <span
                key={tag}
                className="px-5 py-3 rounded-full bg-brand-sand text-sm font-semibold text-brand-deep-plum"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {content.storyImageUrl ? (
            <Image
              src={content.storyImageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <ScentBottle
              accent="#753666"
              tint="#F0EAE2"
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
      </div>
    </div>
  )
}
