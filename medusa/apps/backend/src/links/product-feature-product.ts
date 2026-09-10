import ProductModule from "@medusajs/product"
import { defineLink } from "@medusajs/framework/utils"
import ProductFeatureModule from "../modules/product-feature"

export default defineLink(ProductModule.linkable.product, {
  linkable: ProductFeatureModule.linkable.productFeature,
  isList: true,
})
