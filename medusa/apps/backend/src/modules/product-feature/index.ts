import { Module } from "@medusajs/framework/utils"
import ProductFeatureModuleService from "./service"

export const PRODUCT_FEATURE_MODULE = "productFeature"

export default Module(PRODUCT_FEATURE_MODULE, {
  service: ProductFeatureModuleService,
})
