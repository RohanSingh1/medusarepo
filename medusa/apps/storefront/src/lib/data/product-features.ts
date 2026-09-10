"use server"

import { sdk } from "@lib/config"

export type StoreProductFeature = {
  id: string
  title: string
  description: string
  rank: number
}

export const listProductFeatures = async (
  productId: string
): Promise<StoreProductFeature[]> => {
  return sdk.client
    .fetch<{ features: StoreProductFeature[] }>(
      `/store/products/${productId}/features`,
      { method: "GET" }
    )
    .then(({ features }) => features)
    .catch(() => [])
}
