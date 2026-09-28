import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Poppins, Source_Serif_4 } from "next/font/google"
import "styles/globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

// Display font for headings/eyebrows/stat numbers. Requested stack is
// "Publico Banner", "Source Serif 4", "Playfair Display", Georgia, serif -
// Publico Banner is a commercial Commercial Type foundry font, not on Google
// Fonts, so it can't be loaded without a licensed webfont file. It stays
// first in the CSS stack (see tailwind.config.js) so a licensed @font-face
// added later takes over automatically; Source Serif 4 is what actually
// renders today.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// Dev-only: disable all fetch caching and static rendering so admin/CMS edits
// always show up on refresh without needing to clear .next/cache manually.
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${poppins.variable} ${sourceSerif.variable}`}
    >
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
