import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FOOTER_COLUMNS: { heading: string; items: { label: string; href?: string }[] }[] = [
  {
    heading: "Shop",
    items: [
      { label: "Collection", href: "/store" },
      { label: "Refills" },
      { label: "Gift sets" },
    ],
  },
  {
    heading: "Support",
    items: [{ label: "Shipping" }, { label: "Returns" }, { label: "Contact" }],
  },
  {
    heading: "Company",
    items: [
      { label: "Our story", href: "/#story" },
      { label: "Journal", href: "/#journal" },
      { label: "Stockists" },
    ],
  },
]

export default async function Footer() {
  return (
    <footer className="bg-brand-dark">
      <div className="content-container py-12 small:py-20 grid grid-cols-2 small:grid-cols-4 gap-10">
        <div className="col-span-2 small:col-span-1">
          <LocalizedClientLink
            href="/"
            className="font-display text-2xl tracking-[0.22em] text-white"
          >
            AURA
          </LocalizedClientLink>
          <Text className="text-white/55 text-small-regular mt-3 max-w-[260px]">
            Fine fragrance composed for the cabin.
          </Text>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <div className="text-xsmall-regular uppercase tracking-wide text-white/45 mb-3">
              {col.heading}
            </div>
            <ul className="flex flex-col gap-2.5">
              {col.items.map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <LocalizedClientLink
                      href={item.href}
                      className="text-small-regular text-white/75 hover:text-white transition-colors"
                    >
                      {item.label}
                    </LocalizedClientLink>
                  </li>
                ) : (
                  <li
                    key={item.label}
                    className="text-small-regular text-white/75"
                  >
                    {item.label}
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="content-container pb-8">
        <Text className="text-small-regular text-white/40 pt-5 border-t border-white/10">
          © {new Date().getFullYear()} AURA Fragrance. All prices in AUD.
        </Text>
      </div>
    </footer>
  )
}
