"use server"

import { fetchStrapi } from "./strapi"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1338"

function toAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
}

// Every getter below falls back to the content the AURA reference actually
// ships with. If Strapi is unreachable or a section hasn't been seeded yet,
// the homepage still renders exactly as designed instead of going blank.

export type HomepageContent = {
  heroEyebrow: string
  heroHeadlineLine1: string
  heroHeadlineLine2: string
  heroSubcopy: string
  heroPrimaryCtaLabel: string
  heroPrimaryCtaHref: string
  heroImageUrl: string | null
  storyEyebrow: string
  storyHeadline: string
  storyBody1: string
  storyBody2: string
  storyTags: string[]
  storyImageUrl: string | null
  collectionEyebrow: string
  collectionHeadline: string
  collectionIntro: string
  collectionFinderHeading: string
  collectionFinderQuestions: string[]
  collectionFinderCtaLabel: string
  ctaBannerHeadline: string
  ctaBannerBody: string
  ctaBannerButtonLabel: string
  ctaBannerButtonHref: string
}

const FALLBACK_HOMEPAGE: HomepageContent = {
  heroEyebrow: "Fragrance, Engineered",
  heroHeadlineLine1: "A Signature Scent",
  heroHeadlineLine2: "for Every Drive",
  heroSubcopy:
    "Seven fragrances composed for the cabin. Hand-blended oils, a machined glass vessel, and a diffusion system tuned to the air of a moving car.",
  heroPrimaryCtaLabel: "Explore the Collection",
  heroPrimaryCtaHref: "/store",
  heroImageUrl: null,
  storyEyebrow: "Our Story",
  storyHeadline: "The cabin is the last room nobody designed a scent for.",
  storyBody1:
    "A car interior is a small, sealed, temperature-swinging space. Most air fresheners were built for it by accident. We started the other way round, with perfumers who usually work on fine fragrance, and asked what a composition needs to survive forty degrees of heat and a closed door.",
  storyBody2:
    "The answer was heavier bases, fewer volatile tops, and a diffusion rate slow enough that you stop noticing it and start missing it when it is gone.",
  storyTags: ["Blended in Grasse", "IFRA compliant", "Refillable vessel"],
  storyImageUrl: null,
  collectionEyebrow: "The Collection",
  collectionHeadline: "Seven compositions",
  collectionIntro:
    "Each one is a complete fragrance, not a variant. Pick by the drive you take most.",
  collectionFinderHeading: "Find the one that suits your drive",
  collectionFinderQuestions: [
    "Where you drive",
    "Your cabin size",
    "Scents you already wear",
  ],
  collectionFinderCtaLabel: "Discover your scent →",
  ctaBannerHeadline: "Make Every Drive Memorable",
  ctaBannerBody:
    "Complimentary express delivery. Ninety-day satisfaction guarantee on every bottle.",
  ctaBannerButtonLabel: "Shop the Collection",
  ctaBannerButtonHref: "/store",
}

export type WhyUsReason = {
  id: number
  icon: string
  title: string
  description: string
}

const FALLBACK_WHY_US_REASONS: WhyUsReason[] = [
  {
    id: 0,
    icon: "Clock",
    title: "Long-Lasting Fragrance",
    description:
      "Up to 100 days from one bottle. Heavier base molecules survive cabin heat.",
  },
  {
    id: 1,
    icon: "Droplet",
    title: "Premium Ingredients",
    description: "Fine-fragrance oils, no alcohol carrier, IFRA compliant.",
  },
  {
    id: 2,
    icon: "Sparkles",
    title: "Elegant Design",
    description:
      "Machined cap, weighted glass, refillable body. Made to be seen on a console.",
  },
  {
    id: 3,
    icon: "ShieldCheck",
    title: "Easy Installation",
    description:
      "Three steps, under a minute, no tools. Fits horizontal and vertical vents.",
  },
  {
    id: 4,
    icon: "Wind",
    title: "Adjustable Intensity",
    description: "A three-position collar sets how much air reaches the wick.",
  },
  {
    id: 5,
    icon: "Car",
    title: "Made for Cars",
    description:
      "Tested from minus 10 to 60 degrees. Sealed against spill, stable in sunlight.",
  },
]

export type InsideCarStep = {
  id: number
  stepNumber: string
  title: string
  body: string
  pinTop: string
  pinLeft: string
}

const FALLBACK_INSIDE_CAR_STEPS: InsideCarStep[] = [
  {
    id: 0,
    stepNumber: "01",
    title: "Vent mount",
    body: "A weighted stainless clip grips the blade without rattling. Rotates 30 degrees so the bottle stays level on any vent angle.",
    pinTop: "38%",
    pinLeft: "24%",
  },
  {
    id: 1,
    stepNumber: "02",
    title: "Intensity collar",
    body: "Three positions control the aperture. Turn down in winter when the heater carries scent further, up in summer.",
    pinTop: "62%",
    pinLeft: "55%",
  },
  {
    id: 2,
    stepNumber: "03",
    title: "Sealed reservoir",
    body: "No spill, no leak, no evaporation when parked. The wick draws only when air moves across it.",
    pinTop: "28%",
    pinLeft: "76%",
  },
]

export type Testimonial = {
  id: number
  name: string
  location: string | null
  quote: string
  rating: number
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 0,
    name: "Daniel R.",
    location: "Noir, verified buyer",
    quote:
      "I have had three cars detailed by the same studio and none of them smelled like this. Noir lasted the full quarter in a Range Rover.",
    rating: 5,
  },
  {
    id: 1,
    name: "Priya S.",
    location: "Aqua, verified buyer",
    quote:
      "Bought Aqua for a weekend car that always smelled closed up. It is the first thing passengers mention now.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus T.",
    location: "Oud, verified buyer",
    quote:
      "The price made me hesitate. Three months later the bottle is still going and the cabin still smells composed, not sprayed.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena K.",
    location: "Velvet, verified buyer",
    quote:
      "Install took under a minute and the vent clip does not rattle, which was my main worry.",
    rating: 5,
  },
]

export type JournalEntry = {
  id: number
  category: string
  title: string
  accentColor: string
  thumbnailUrl: string | null
}

const FALLBACK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 0,
    category: "Craft",
    title: "Why cabin heat destroys most fragrance",
    accentColor: "#6B5B43",
    thumbnailUrl: null,
  },
  {
    id: 1,
    category: "Guides",
    title: "Matching a scent to your interior",
    accentColor: "#14708F",
    thumbnailUrl: null,
  },
  {
    id: 2,
    category: "Studio",
    title: "Three days in Grasse with our perfumer",
    accentColor: "#8A5A17",
    thumbnailUrl: null,
  },
]

type StrapiMedia = { url: string } | null

type StrapiHomepageEntry = Omit<
  Partial<HomepageContent>,
  "heroImageUrl" | "storyImageUrl"
> & {
  heroImage?: StrapiMedia
  storyImage?: StrapiMedia
}

export const getHomepageContent = async (): Promise<HomepageContent> => {
  return fetchStrapi<{ data: StrapiHomepageEntry | null }>("/homepage", {
    "populate[heroImage]": "true",
    "populate[storyImage]": "true",
  })
    .then(({ data }) => {
      if (!data) return FALLBACK_HOMEPAGE
      const { heroImage, storyImage, ...rest } = data
      return {
        ...FALLBACK_HOMEPAGE,
        ...rest,
        heroImageUrl: toAbsoluteUrl(heroImage?.url) ?? FALLBACK_HOMEPAGE.heroImageUrl,
        storyImageUrl: toAbsoluteUrl(storyImage?.url) ?? FALLBACK_HOMEPAGE.storyImageUrl,
      }
    })
    .catch(() => FALLBACK_HOMEPAGE)
}

type StrapiWhyUsReasonEntry = {
  id: number
  icon: string
  title: string
  description: string
}

export const listWhyUsReasons = async (): Promise<WhyUsReason[]> => {
  return fetchStrapi<{ data: StrapiWhyUsReasonEntry[] }>("/why-us-reasons", {
    "sort[0]": "order:asc",
  })
    .then(({ data }) =>
      data.length
        ? data.map((r) => ({
            id: r.id,
            icon: r.icon,
            title: r.title,
            description: r.description,
          }))
        : FALLBACK_WHY_US_REASONS
    )
    .catch(() => FALLBACK_WHY_US_REASONS)
}

type StrapiInsideCarStepEntry = {
  id: number
  stepNumber: string
  title: string
  body: string
  pinTop: string | null
  pinLeft: string | null
}

export const listInsideCarSteps = async (): Promise<InsideCarStep[]> => {
  return fetchStrapi<{ data: StrapiInsideCarStepEntry[] }>("/inside-car-steps", {
    "sort[0]": "order:asc",
  })
    .then(({ data }) =>
      data.length
        ? data.map((s) => ({
            id: s.id,
            stepNumber: s.stepNumber,
            title: s.title,
            body: s.body,
            pinTop: s.pinTop || "50%",
            pinLeft: s.pinLeft || "50%",
          }))
        : FALLBACK_INSIDE_CAR_STEPS
    )
    .catch(() => FALLBACK_INSIDE_CAR_STEPS)
}

type StrapiTestimonialEntry = {
  id: number
  name: string
  location: string | null
  quote: string
  rating: number
}

export const listTestimonials = async (): Promise<Testimonial[]> => {
  return fetchStrapi<{ data: StrapiTestimonialEntry[] }>("/testimonials", {
    "sort[0]": "order:asc",
  })
    .then(({ data }) =>
      data.length
        ? data.map((t) => ({
            id: t.id,
            name: t.name,
            location: t.location,
            quote: t.quote,
            rating: t.rating,
          }))
        : FALLBACK_TESTIMONIALS
    )
    .catch(() => FALLBACK_TESTIMONIALS)
}

type StrapiJournalEntryEntry = {
  id: number
  category: string
  title: string
  accentColor: string | null
  thumbnail?: StrapiMedia
}

export const listJournalEntries = async (): Promise<JournalEntry[]> => {
  return fetchStrapi<{ data: StrapiJournalEntryEntry[] }>("/journal-entries", {
    "sort[0]": "order:asc",
    "populate[thumbnail]": "true",
  })
    .then(({ data }) =>
      data.length
        ? data.map((e) => ({
            id: e.id,
            category: e.category,
            title: e.title,
            accentColor: e.accentColor || "#3B1A33",
            thumbnailUrl: toAbsoluteUrl(e.thumbnail?.url),
          }))
        : FALLBACK_JOURNAL_ENTRIES
    )
    .catch(() => FALLBACK_JOURNAL_ENTRIES)
}
