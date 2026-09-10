import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createCollectionsWorkflow,
  batchLinkProductsToCollectionWorkflow,
} from "@medusajs/medusa/core-flows";

// SKUs that had "Is featured?" = 1 in the original WooCommerce export.
// (HELLYIDB7 is excluded - it had no price in the export so was never imported.)
const FEATURED_SKUS = [
  "BOSCOARGENT2285",
  "FRONDAPERLA2060",
  "ROHARDGRYAS1561",
  "MOSARABESQ6274",
  "LUCCABIANC60120",
  "LUNABEIGEAS6060",
  "BRONTEGOLD4060",
  "GRANOTRVPAVFR30",
  "DESIGNANTRA3060",
];

const COLLECTION_TITLE = "Featured";
const COLLECTION_HANDLE = "featured";

/**
 * Creates (or reuses) a "Featured" collection and links the products carried
 * over from WooCommerce's "Is featured?" flag to it, so the storefront's
 * homepage featured-products section has something real to pull from.
 *
 * Usage: npx medusa exec ./src/migration-scripts/tag-featured-products.ts
 */
export default async function tagFeaturedProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
  });
  let collection = collections.find((c) => c.handle === COLLECTION_HANDLE);

  if (!collection) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: {
        collections: [
          { title: COLLECTION_TITLE, handle: COLLECTION_HANDLE },
        ],
      },
    });
    collection = result[0];
    logger.info(`Created "${COLLECTION_TITLE}" collection.`);
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "variants.sku"],
  });

  const productIds = products
    .filter((p) =>
      (p.variants ?? []).some(
        (v) => v.sku && FEATURED_SKUS.includes(v.sku)
      )
    )
    .map((p) => p.id);

  const missing = FEATURED_SKUS.filter(
    (sku) =>
      !products.some((p) => (p.variants ?? []).some((v) => v.sku === sku))
  );
  if (missing.length) {
    logger.warn(`SKUs not found (not imported?): ${missing.join(", ")}`);
  }

  if (productIds.length) {
    await batchLinkProductsToCollectionWorkflow(container).run({
      input: { id: collection.id, add: productIds },
    });
    logger.info(
      `Linked ${productIds.length} product(s) to the "${COLLECTION_TITLE}" collection.`
    );
  } else {
    logger.info("No matching products found to link.");
  }
}
