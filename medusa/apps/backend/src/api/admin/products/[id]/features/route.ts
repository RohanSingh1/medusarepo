import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { PRODUCT_FEATURE_MODULE } from "../../../../../modules/product-feature"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "product_features.*"],
    filters: { id: req.params.id },
  })

  res.json({ features: data[0]?.product_features ?? [] })
}

type CreateFeatureBody = {
  title: string
  description: string
  rank?: number
}

export async function POST(
  req: AuthenticatedMedusaRequest<CreateFeatureBody>,
  res: MedusaResponse
) {
  const productFeatureModuleService = req.scope.resolve(
    PRODUCT_FEATURE_MODULE
  )
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)

  const feature = await productFeatureModuleService.createProductFeatures({
    title: req.body.title,
    description: req.body.description,
    rank: req.body.rank ?? 0,
  })

  await link.create({
    [Modules.PRODUCT]: { product_id: req.params.id },
    [PRODUCT_FEATURE_MODULE]: { product_feature_id: feature.id },
  })

  res.json({ feature })
}
