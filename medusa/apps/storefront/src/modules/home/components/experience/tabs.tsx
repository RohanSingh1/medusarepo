"use client"

import { useState } from "react"

import { clx } from "@modules/common/components/ui"
import ScentBottle from "@modules/home/components/scent-bottle"

export type ExperienceEntry = {
  id: string
  name: string
  accent: string
  tint: string
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
}

const LAYERS = [
  {
    key: "top" as const,
    label: "Top",
    sub: "The first thirty seconds",
    body: "What reaches you as the door closes. Volatile, bright, and gone before the first set of lights.",
  },
  {
    key: "heart" as const,
    label: "Heart",
    sub: "Minutes two to twenty",
    body: "The character of the fragrance. This is what the cabin smells like for most of a drive.",
  },
  {
    key: "base" as const,
    label: "Base",
    sub: "Hours, then weeks",
    body: "Heavy molecules that settle into the interior and carry the scent across months, not days.",
  },
]

const ExperienceTabs = ({ entries }: { entries: ExperienceEntry[] }) => {
  const [selected, setSelected] = useState(0)
  const [layer, setLayer] = useState<"top" | "heart" | "base">("top")
  const entry = entries[Math.min(selected, entries.length - 1)]
  const activeLayer = LAYERS.find((l) => l.key === layer)!
  const notes =
    layer === "top"
      ? entry.topNotes
      : layer === "heart"
      ? entry.heartNotes
      : entry.baseNotes

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5 mb-10">
        {entries.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => {
              setSelected(i)
              setLayer("top")
            }}
            className={clx(
              "px-5 py-2.5 rounded-full text-small-semi transition-colors",
              i === selected
                ? "bg-brand-primary text-white"
                : "bg-brand-cream text-brand-dark hover:bg-brand-secondary/60"
            )}
          >
            {e.name}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-1 small:grid-cols-2 gap-8 small:gap-14 items-center rounded-[28px] p-6 small:p-12 transition-colors duration-500"
        style={{ backgroundColor: entry.tint }}
      >
        <ScentBottle
          accent={entry.accent}
          tint={entry.tint}
          className="aspect-square rounded-large"
        />
        <div>
          <div className="flex gap-2 mb-6">
            {LAYERS.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setLayer(l.key)}
                className={clx(
                  "flex-1 text-center py-3 rounded-full text-small-semi transition-colors",
                  layer === l.key
                    ? "text-white"
                    : "bg-white/70 text-brand-dark"
                )}
                style={layer === l.key ? { backgroundColor: entry.accent } : undefined}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div
            className="text-xsmall-regular uppercase tracking-wide mb-2"
            style={{ color: entry.accent }}
          >
            {activeLayer.sub}
          </div>
          <div className="font-display text-2xl-semi text-ui-fg-base mb-3">
            {activeLayer.label} notes
          </div>
          <p className="text-ui-fg-subtle mb-5">{activeLayer.body}</p>
          <div className="flex flex-wrap gap-2.5">
            {notes.map((n) => (
              <div
                key={n}
                className="px-4 py-2.5 rounded-large bg-white text-small-regular text-ui-fg-base shadow-elevation-card-rest"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExperienceTabs
