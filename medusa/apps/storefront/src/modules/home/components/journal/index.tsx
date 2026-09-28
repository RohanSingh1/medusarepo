import { Heading } from "@modules/common/components/ui"

// Placeholder entries matching the design reference - there's no blog engine
// behind this yet, so these are non-linked cards, not real published posts.
const ENTRIES = [
  {
    category: "Craft",
    title: "Why cabin heat destroys most fragrance",
    accent: "#6B5B43",
  },
  {
    category: "Guides",
    title: "Matching a scent to your interior",
    accent: "#14708F",
  },
  {
    category: "Studio",
    title: "Three days in Grasse with our perfumer",
    accent: "#8A5A17",
  },
]

export default function Journal() {
  return (
    <div id="journal" className="content-container py-12 small:py-24">
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6">
        <Heading level="h2" className="text-2xl-semi small:text-3xl-semi">
          Journal
        </Heading>
        <span className="text-small-semi text-brand-primary">All entries</span>
      </div>
      <div className="grid grid-cols-1 small:grid-cols-3 gap-5">
        {ENTRIES.map((entry) => (
          <div
            key={entry.title}
            className="rounded-large overflow-hidden bg-white shadow-elevation-card-rest transition-transform duration-300 hover:-translate-y-1.5"
          >
            <div
              className="h-[160px]"
              style={{ backgroundColor: entry.accent }}
            />
            <div className="p-5">
              <div className="text-xsmall-regular uppercase tracking-wide text-ui-fg-muted">
                {entry.category}
              </div>
              <div className="font-display text-large-semi text-ui-fg-base mt-2 leading-snug">
                {entry.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
