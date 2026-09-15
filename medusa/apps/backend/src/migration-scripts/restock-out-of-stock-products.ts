import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows";

// PLACEHOLDER quantity only - the WooCommerce export had no real stock
// number for these products (either blank or "0"), so there's no genuine
// figure to restore. This just unblocks browsing/testing on the dev site.
// Replace with real stock counts from TFO before launch.
const PLACEHOLDER_QUANTITY = 25;

/**
 * Sets a placeholder positive stock quantity on every product variant whose
 * inventory is currently at 0, so they're no longer hidden by the storefront's
 * out-of-stock filtering.
 *
 * Usage: npx medusa exec ./src/migration-scripts/restock-out-of-stock-products.ts
 */
export default async function restockOutOfStockProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "variants.inventory_items.inventory_item_id",
      "variants.inventory_items.inventory.location_levels.location_id",
      "variants.inventory_items.inventory.location_levels.stocked_quantity",
    ],
  });

  const updates: {
    inventory_item_id: string;
    location_id: string;
    stocked_quantity: number;
  }[] = [];
  const restockedTitles: string[] = [];

  for (const product of products) {
    for (const variant of product.variants ?? []) {
      for (const item of variant.inventory_items ?? []) {
        const levels = item.inventory?.location_levels ?? [];
        for (const level of levels) {
          if ((level.stocked_quantity ?? 0) <= 0) {
            updates.push({
              inventory_item_id: item.inventory_item_id,
              location_id: level.location_id,
              stocked_quantity: PLACEHOLDER_QUANTITY,
            });
            restockedTitles.push(product.title);
          }
        }
      }
    }
  }

  if (!updates.length) {
    logger.info("No out-of-stock inventory levels found.");
    return;
  }

  await updateInventoryLevelsWorkflow(container).run({
    input: { updates },
  });

  logger.info(
    `Restocked ${updates.length} inventory level(s) to a placeholder quantity of ${PLACEHOLDER_QUANTITY}: ${JSON.stringify(
      restockedTitles
    )}`
  );
}
