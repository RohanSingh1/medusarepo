import { MedusaService } from "@medusajs/framework/utils"
import ProductFeature from "./models/product-feature"

class ProductFeatureModuleService extends MedusaService({
  ProductFeature,
}) {}

export default ProductFeatureModuleService
