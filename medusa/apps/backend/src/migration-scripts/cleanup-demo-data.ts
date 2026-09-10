import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  deleteProductsWorkflow,
  deleteProductCategoriesWorkflow,
  cancelOrderWorkflow,
} from "@medusajs/medusa/core-flows";

const DEMO_PRODUCT_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];
const DEMO_PRODUCT_TITLES = ["sss"];
const DEMO_CATEGORY_NAMES = ["Shirts", "Sweatshirts", "Pants", "Merch"];

/**
 * One-time cleanup of the Medusa starter's demo/seed data (the T-Shirt/Sweatshirt/
 * Sweatpants/Shorts products, the "sss" test product, and their placeholder
 * categories) so the catalog only contains real imported products.
 *
 * The "sss" product has a pending test order holding an inventory reservation
 * against it, which blocks product deletion - that order is canceled first.
 *
 * Usage: npx medusa exec ./src/migration-scripts/cleanup-demo-data.ts
 */
export default async function cleanupDemoData({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle"],
  });

  const productIds = products
    .filter(
      (p) =>
        DEMO_PRODUCT_HANDLES.includes(p.handle) ||
        DEMO_PRODUCT_TITLES.includes(p.title)
    )
    .map((p) => p.id);

  if (productIds.length) {
    // Pending orders holding a reservation against one of these products block
    // deletion. Cancel any such orders first (releases their reservations).
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "status", "items.product_id"],
    });
    const affectedOrders = orders.filter((o) =>
      (o.items ?? []).some((i) => productIds.includes(i.product_id))
    );

    for (const order of affectedOrders) {
      if (order.status !== "canceled") {
        await cancelOrderWorkflow(container).run({
          input: { order_id: order.id },
        });
        logger.info(`Canceled order #${order.display_id} (${order.id}).`);
      }
    }
  }

  if (productIds.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: productIds },
    });
    logger.info(`Deleted ${productIds.length} demo product(s).`);
  } else {
    logger.info("No demo products found to delete.");
  }

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });

  const categoryIds = categories
    .filter((c) => DEMO_CATEGORY_NAMES.includes(c.name))
    .map((c) => c.id);

  if (categoryIds.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: categoryIds,
    });
    logger.info(`Deleted ${categoryIds.length} demo categor(y/ies).`);
  } else {
    logger.info("No demo categories found to delete.");
  }
}
