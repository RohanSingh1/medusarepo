"use client"

import { useState } from "react"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Text, clx } from "@modules/common/components/ui"

export type ExplorerEntry = {
  handle: string
  label: string
  productTitle: string
  productHandle: string
  image: string
  material: string | null
  dimensions: string | null
  origin: string | null
  price: string | null
}

const CategoryExplorerTabs = ({ entries }: { entries: ExplorerEntry[] }) => {
  const [selected, setSelected] = useState(0)
  const entry = entries[Math.min(selected, entries.length - 1)]

  const specs = [
    { label: "Material", value: entry.material },
    { label: "Size", value: entry.dimensions },
    { label: "Origin", value: entry.origin },
  ].filter((s) => !!s.value)

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5 mb-10">
        {entries.map((e, i) => (
          <button
            key={e.handle}
            type="button"
            onClick={() => setSelected(i)}
            className={clx(
              "px-5 py-2.5 rounded-full text-small-semi transition-colors",
              i === selected
                ? "bg-brand-primary text-white"
                : "bg-brand-cream text-brand-dark hover:bg-brand-secondary/60"
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-8 small:gap-14 items-center rounded-[28px] bg-brand-cream p-6 small:p-12">
        <div className="relative aspect-square rounded-large overflow-hidden">
          <Image
            key={entry.image}
            src={entry.image}
            alt={entry.productTitle}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-small-semi uppercase tracking-wide text-brand-primary mb-2">
            {entry.label}
          </div>
          <div className="text-2xl-semi font-semibold text-ui-fg-base mb-4">
            {entry.productTitle}
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            {specs.map((s) => (
              <div
                key={s.label}
                className="px-5 py-3 rounded-large bg-white shadow-elevation-card-rest"
              >
                <div className="text-xsmall-regular uppercase tracking-wide text-ui-fg-muted">
                  {s.label}
                </div>
                <div className="text-base-semi text-ui-fg-base mt-0.5">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {entry.price && (
              <Text className="text-2xl-semi font-semibold text-ui-fg-base">
                {entry.price}
              </Text>
            )}
            <LocalizedClientLink href={`/products/${entry.productHandle}`}>
              <Button variant="primary">View this tile</Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryExplorerTabs
