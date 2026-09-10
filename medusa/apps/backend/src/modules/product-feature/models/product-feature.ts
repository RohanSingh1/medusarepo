import { model } from "@medusajs/framework/utils"

const ProductFeature = model.define("product_feature", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text(),
  rank: model.number().default(0),
})

export default ProductFeature
