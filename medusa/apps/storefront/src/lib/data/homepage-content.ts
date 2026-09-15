"use server"

import { fetchStrapi } from "./strapi"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1338"

function toAbsoluteUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
}

export type HeroSlide = {
  id: number
  eyebrow: string | null
  title: string
  subtitle: string | null
  ctaLabel: string | null
  ctaHref: string | null
  imageUrl: string | null
}

export type WhyUsItem = {
  id: number
  icon: string
  title: string
  description: string
}

export type Testimonial = {
  id: number
  name: string
  location: string | null
  quote: string
  rating: number
}

type StrapiHeroSlideEntry = {
  id: number
  eyebrow: string | null
  title: string
  subtitle: string | null
  ctaLabel: string | null
  ctaHref: string | null
  image: { url: string } | null
}

type StrapiWhyUsItemEntry = {
  id: number
  icon: string
  title: string
  description: string
}

type StrapiTestimonialEntry = {
  id: number
  name: string
  location: string | null
  quote: string
  rating: number
}

export const listHeroSlides = async (): Promise<HeroSlide[]> => {
  return fetchStrapi<{ data: StrapiHeroSlideEntry[] }>("/hero-slides", {
    "sort[0]": "order:asc",
    "populate": "image",
  })
    .then(({ data }) =>
      data.map((slide) => ({
        id: slide.id,
        eyebrow: slide.eyebrow,
        title: slide.title,
        subtitle: slide.subtitle,
        ctaLabel: slide.ctaLabel,
        ctaHref: slide.ctaHref,
        imageUrl: toAbsoluteUrl(slide.image?.url),
      }))
    )
    .catch(() => [])
}

export const listWhyUsItems = async (): Promise<WhyUsItem[]> => {
  return fetchStrapi<{ data: StrapiWhyUsItemEntry[] }>("/why-us-items", {
    "sort[0]": "order:asc",
  })
    .then(({ data }) =>
      data.map((item) => ({
        id: item.id,
        icon: item.icon,
        title: item.title,
        description: item.description,
      }))
    )
    .catch(() => [])
}

export const listTestimonials = async (): Promise<Testimonial[]> => {
  return fetchStrapi<{ data: StrapiTestimonialEntry[] }>("/testimonials", {
    "sort[0]": "order:asc",
  })
    .then(({ data }) =>
      data.map((t) => ({
        id: t.id,
        name: t.name,
        location: t.location,
        quote: t.quote,
        rating: t.rating,
      }))
    )
    .catch(() => [])
}
