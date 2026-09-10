"use server"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1338"

export const fetchStrapi = async <T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> => {
  const query = new URLSearchParams(params).toString()
  const url = `${STRAPI_URL}/api${path}${query ? `?${query}` : ""}`

  const res = await fetch(url, {
    headers: {
      ...(process.env.STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
        : {}),
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${path}`)
  }

  return res.json()
}
