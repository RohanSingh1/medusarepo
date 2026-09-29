import Image from "next/image"

import { listJournalEntries } from "@lib/data/homepage-content"
import { Heading } from "@modules/common/components/ui"

export default async function Journal() {
  const entries = await listJournalEntries()

  return (
    <div id="journal" className="content-container py-12 small:py-24">
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6">
        <Heading
          level="h2"
          className="font-display font-normal text-brand-deep-plum text-[26px] small:text-[38px]"
        >
          Journal
        </Heading>
        <span className="text-sm font-semibold text-brand-pink">All entries</span>
      </div>
      <div className="grid grid-cols-1 small:grid-cols-3 gap-5">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-[16px] overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1.5"
          >
            {entry.thumbnailUrl ? (
              <div className="relative h-[160px]">
                <Image
                  src={entry.thumbnailUrl}
                  alt={entry.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="h-[160px]"
                style={{ backgroundColor: entry.accentColor }}
              />
            )}
            <div className="p-5">
              <div className="text-xs uppercase tracking-wide font-semibold text-brand-deep-plum/50">
                {entry.category}
              </div>
              {/* Card title = sub-heading, not display type - Inter Bold */}
              <p className="font-sans font-bold text-lg text-brand-deep-plum mt-2 leading-snug">
                {entry.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
