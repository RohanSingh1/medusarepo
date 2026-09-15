import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Poppins } from "next/font/google"
import "styles/globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
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
    <html lang="en" data-mode="light" className={poppins.variable}>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
