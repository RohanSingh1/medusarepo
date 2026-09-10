import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { PRODUCT_FEATURE_MODULE } from "../../../../../../modules/product-feature"

type UpdateFeatureBody = {
  title?: string
  description?: string
  rank?: number
}

export async function POST(
  req: AuthenticatedMedusaRequest<UpdateFeatureBody>,
  res: MedusaResponse
) {
  const productFeatureModuleService = req.scope.resolve(
    PRODUCT_FEATURE_MODULE
  )

  const feature = await productFeatureModuleService.updateProductFeatures({
    id: req.params.featureId,
    ...req.body,
  })

  res.json({ feature })
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const productFeatureModuleService = req.scope.resolve(
    PRODUCT_FEATURE_MODULE
  )
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK)

  await link.dismiss({
    [Modules.PRODUCT]: { product_id: req.params.id },
    [PRODUCT_FEATURE_MODULE]: { product_feature_id: req.params.featureId },
  })

  await productFeatureModuleService.deleteProductFeatures(req.params.featureId)

  res.json({ id: req.params.featureId, deleted: true })
}
