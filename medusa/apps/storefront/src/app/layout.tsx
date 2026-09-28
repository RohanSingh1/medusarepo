import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Poppins } from "next/font/google"
import localFont from "next/font/local"
import "styles/globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

// Display font for headings/eyebrows/stat numbers - the real, licensed
// Publico Banner file from the org's design system (../fonts), not a
// Google Fonts stand-in.
const publicoBanner = localFont({
  src: "../fonts/PublicoBanner-Roman.otf",
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
      className={`${poppins.variable} ${publicoBanner.variable}`}
    >
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
