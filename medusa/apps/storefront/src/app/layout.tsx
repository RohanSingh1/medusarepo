import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import localFont from "next/font/local"
import "styles/globals.css"

// Body font - the design system's real Inter variable file, replacing the
// earlier Google Fonts Poppins stand-in.
const inter = localFont({
  src: "../fonts/Inter-Variable.ttf",
  variable: "--font-body",
  display: "swap",
})

// Display font for headings/eyebrows/stat numbers - the real, licensed
// Publico Banner file from the org's design system.
const publicoBanner = localFont({
  src: "../fonts/PublicoBanner-Roman.otf",
  variable: "--font-display",
  display: "swap",
})

// Script accent font for the AURA wordmark only (logo/header/footer) - a
// commercially-licensed copy per the org, despite the source filename.
const gellatio = localFont({
  src: "../fonts/Gellatio.ttf",
  variable: "--font-script",
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
      className={`${inter.variable} ${publicoBanner.variable} ${gellatio.variable}`}
    >
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
