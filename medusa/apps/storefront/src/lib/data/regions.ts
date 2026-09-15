"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    revalidate: 60,
    ...(await getCacheOptions("regions")),
  }

  return await sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    revalidate: 60,
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return await sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
}

// Unlike the fetch-level `revalidate` above, this in-memory map has no TTL of
// its own, so a country code once resolved (or found missing) stuck that way
// for the life of the server process - e.g. a new region added after boot
// never showed up here even though the underlying fetch had gone stale and
// refetched. Mirror the 1-hour TTL the storefront's middleware already uses
// for its own region map.
let regionMap = new Map<string, HttpTypes.StoreRegion>()
let regionMapUpdatedAt = 0
const REGION_MAP_TTL_MS = 3600 * 1000

export const getRegion = async (countryCode: string) => {
  const isStale = Date.now() - regionMapUpdatedAt > REGION_MAP_TTL_MS

  if (!isStale && regionMap.has(countryCode)) {
    return regionMap.get(countryCode)
  }

  const regions = await listRegions()

  if (!regions) {
    return null
  }

  const freshMap = new Map<string, HttpTypes.StoreRegion>()
  regions.forEach((region) => {
    region.countries?.forEach((c) => {
      freshMap.set(c?.iso_2 ?? "", region)
    })
  })
  regionMap = freshMap
  regionMapUpdatedAt = Date.now()

  const region = countryCode
    ? regionMap.get(countryCode)
    : regionMap.get("us")

  return region
}
