import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows";

// One-off: creates a single, single-variant test product on whatever database
// this script is pointed at (see chat - used to verify single-variant product
// rendering end-to-end on the live Railway-hosted backend). Safe to delete
// via the admin once verified.

const CURRENCY_CODE = "aud";
const HANDLE = "test-single-variant-tile";

export default async function createTestSingleVariantProduct({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: HANDLE },
  });
  if (existing.length) {
    logger.info(`"${HANDLE}" already exists (id ${existing[0].id}). Skipping.`);
    return;
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  });
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  });
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });

  const salesChannel = salesChannels[0];
  const stockLocation = stockLocations[0];
  const shippingProfile = shippingProfiles[0];

  if (!salesChannel || !stockLocation || !shippingProfile) {
    logger.error(
      "Missing base store setup (sales channel / stock location / shipping profile)."
    );
    return;
  }

  const {
    result: [product],
  } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "TEST - Single Variant Tile",
          handle: HANDLE,
          description:
            "Placeholder test product with a single variant, created to verify single-variant rendering on the live site. Safe to delete.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: salesChannel.id }],
          metadata: { source: "manual-test" },
          options: [
            { title: "Default option", values: ["Default option value"] },
          ],
          variants: [
            {
              title: "Default variant",
              sku: "TEST-SINGLE-VARIANT",
              options: { "Default option": "Default option value" },
              prices: [{ amount: 49, currency_code: CURRENCY_CODE }],
            },
          ],
        },
      ],
    },
  });

  const { data: variantData } = await query.graph({
    entity: "product_variant",
    fields: ["id", "inventory_items.inventory_item_id"],
    filters: { product_id: product.id },
  });
  const inventoryItemId = variantData[0]?.inventory_items?.[0]?.inventory_item_id;
  if (inventoryItemId) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: [
          {
            location_id: stockLocation.id,
            inventory_item_id: inventoryItemId,
            stocked_quantity: 25,
          },
        ],
      },
    });
  }

  logger.info(`Created "${product.title}" -> ${product.handle} (id ${product.id})`);
}
