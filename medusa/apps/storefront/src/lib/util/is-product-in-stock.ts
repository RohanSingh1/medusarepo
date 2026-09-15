import { HttpTypes } from "@medusajs/types"

/**
 * Mirrors the add-to-cart eligibility rule in `ProductActions` so listings and
 * the product detail page agree on what "in stock" means.
 */
export function isVariantInStock(
  variant?: HttpTypes.StoreProductVariant | null
): boolean {
  if (!variant) {
    return false
  }

  if (!variant.manage_inventory) {
    return true
  }

  if (variant.allow_backorder) {
    return true
  }

  return (variant.inventory_quantity ?? 0) > 0
}

/**
 * A product is in stock if at least one of its variants is purchasable.
 * Requires `variants.inventory_quantity` (and the base `manage_inventory`/
 * `allow_backorder` scalars) to have been requested via the product query's
 * `fields` param - otherwise `inventory_quantity` comes back `undefined` and
 * every managed-inventory variant will look out of stock.
 */
export function isProductInStock(product: HttpTypes.StoreProduct): boolean {
  const variants = product.variants ?? []

  if (!variants.length) {
    return true
  }

  return variants.some(isVariantInStock)
}
