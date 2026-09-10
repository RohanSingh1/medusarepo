import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "product_features.title", "product_features.description", "product_features.rank"],
    filters: { id: req.params.id },
  })

  const features = (data[0]?.product_features ?? []).sort(
    (a: { rank: number }, b: { rank: number }) => a.rank - b.rank
  )

  res.json({ features })
}
