import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  createInventoryLevelsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { PRODUCT_FEATURE_MODULE } from "../modules/product-feature";

// ---------------------------------------------------------------------------
// Config / assumptions (see the chat summary for the reasoning behind these):
// - Store currency for imported prices: AUD.
// - Weight column (kg) -> grams. Length/Width/Height columns (mm) -> cm.
// - "Sale price" (if lower than "Regular price") becomes the selling price;
//   "Regular price" is kept as `original_price_aud` in metadata for a future
//   "was $X" display - Medusa has no built-in compare-at price in this version.
// - Only WooCommerce "simple" products are supported. Other types are skipped
//   with a warning so a future export with variable/bundle products doesn't
//   silently import wrong data.
// - Re-running with the same file is safe: products are matched by handle and
//   skipped if they already exist; categories are matched by name+parent.
// ---------------------------------------------------------------------------

const CURRENCY_CODE = "aud";

type Csv = Record<string, string>;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .trim();
}

/** Normalizes the WooCommerce export's mixed literal "\n" + real newlines into real newlines. */
function normalizeNewlines(input: string): string {
  return input.replace(/\\n/g, "\n");
}

/** Turns a long-description HTML blob into plain text, one line per block. */
function htmlBlockToPlainText(html: string | undefined): string {
  if (!html) return "";
  let s = normalizeNewlines(html);
  s = s.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li)>/gi, "\n");
  s = stripHtml(s);
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

/**
 * Parses the WooCommerce "Short description" column, which for this catalog
 * is a list of "<b>Key:</b> Value" spec lines (Material, Finish, Size, ...)
 * plus occasional free-text paragraphs. Spec lines become product features
 * (shown via the product-feature widget); anything else is kept as extra
 * description text so no content is lost.
 */
function parseFeaturesAndExtra(
  shortDescription: string | undefined
): { features: { title: string; description: string }[]; extra: string } {
  if (!shortDescription) return { features: [], extra: "" };

  const lines = normalizeNewlines(shortDescription)
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const features: { title: string; description: string }[] = [];
  const extraLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^<b>\s*([^<:]+):?\s*<\/b>\s*(.*)$/i);
    if (match) {
      const title = stripHtml(match[1]).trim();
      const description = stripHtml(match[2]).trim();
      if (title && description) {
        features.push({ title, description });
        continue;
      }
    }
    const plain = stripHtml(line);
    if (plain) extraLines.push(plain);
  }

  return { features, extra: extraLines.join("\n") };
}

function deriveHandle(row: Csv): string {
  const url = row["Meta: _product_url"];
  if (url) {
    const segment = url.split("/").filter(Boolean).pop();
    if (segment) return slugify(segment);
  }
  return slugify(row.Name || row.SKU || "");
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function catKey(parentId: string | undefined, name: string): string {
  return `${parentId ?? "root"}::${name.trim().toLowerCase()}`;
}

/**
 * Medusa workflow errors don't always arrive as real `Error` instances in this
 * scope (they can cross a serialization boundary in the workflow engine), so
 * `instanceof Error` isn't reliable - fall back to reading `.message` off
 * whatever shape comes back.
 */
function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return String(err);
}

export default async function importWooCommerceCsv({
  container,
  args,
}: {
  container: MedusaContainer;
  args: string[];
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const csvPathArg = args?.[0];
  if (!csvPathArg) {
    logger.error(
      "Usage: npx medusa exec ./src/migration-scripts/import-woocommerce-csv.ts <path-to-csv>"
    );
    return;
  }

  const absCsvPath = path.resolve(process.cwd(), csvPathArg);
  if (!fs.existsSync(absCsvPath)) {
    logger.error(`CSV file not found: ${absCsvPath}`);
    return;
  }

  const rows: Csv[] = parse(fs.readFileSync(absCsvPath, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });
  logger.info(`Loaded ${rows.length} row(s) from ${absCsvPath}.`);

  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const productFeatureModuleService = container.resolve(
    PRODUCT_FEATURE_MODULE
  );

  // -------------------------------------------------------------------------
  // 1. Ensure AUD currency + an Australia region + AU tax region exist.
  // -------------------------------------------------------------------------
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code"],
  });
  const store = stores[0];
  if (!store) {
    logger.error("No store found. Run the initial data seed first.");
    return;
  }

  const hasAud = store.supported_currencies.some(
    (c) => c.currency_code === CURRENCY_CODE
  );
  if (!hasAud) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            { currency_code: CURRENCY_CODE, is_default: true },
            ...store.supported_currencies.map((c) => ({
              currency_code: c.currency_code,
              is_default: false,
            })),
          ],
        },
      },
    });
    logger.info("Added AUD as the store's default currency.");
  }

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"],
  });
  let auRegion = regions.find((r) => r.currency_code === CURRENCY_CODE);
  if (!auRegion) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Australia",
            currency_code: CURRENCY_CODE,
            countries: ["au"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    auRegion = result[0];
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "au", provider_id: "tp_system" }],
    });
    logger.info("Created Australia region and AU tax region.");
  }

  // -------------------------------------------------------------------------
  // 2. Reuse the existing sales channel / stock location / shipping profile.
  // -------------------------------------------------------------------------
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  });

  const salesChannel = salesChannels[0];
  const stockLocation = stockLocations[0];
  const shippingProfile = shippingProfiles[0];

  if (!salesChannel || !stockLocation || !shippingProfile) {
    logger.error(
      "Missing base store setup (sales channel / stock location / shipping profile). Run the initial data seed first."
    );
    return;
  }

  // -------------------------------------------------------------------------
  // 3. Preload existing categories & products so re-runs are idempotent.
  // -------------------------------------------------------------------------
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "parent_category_id"],
  });
  const categoryCache = new Map<string, string>();
  // Medusa derives each category's handle from its name and requires handles
  // to be globally unique, but this catalog reuses the same category name
  // under different parents (e.g. "Room > Outdoor" and "TFO Collections >
  // Outdoor"). This secondary cache lets same-named categories collapse onto
  // the first one created instead of erroring on the second.
  const categoryHandleCache = new Map<string, string>();
  for (const c of existingCategories) {
    categoryCache.set(catKey(c.parent_category_id ?? undefined, c.name), c.id);
    const handle = slugify(c.name);
    if (!categoryHandleCache.has(handle)) categoryHandleCache.set(handle, c.id);
  }

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });
  const existingHandles = new Set(existingProducts.map((p) => p.handle));

  async function getOrCreateCategory(
    name: string,
    parentId: string | undefined
  ): Promise<string> {
    const key = catKey(parentId, name);
    const cached = categoryCache.get(key);
    if (cached) return cached;

    const handle = slugify(name);
    try {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [
            {
              name,
              is_active: true,
              ...(parentId ? { parent_category_id: parentId } : {}),
            },
          ],
        },
      });
      const id = result[0].id;
      categoryCache.set(key, id);
      if (!categoryHandleCache.has(handle)) categoryHandleCache.set(handle, id);
      return id;
    } catch (err) {
      const existingId = categoryHandleCache.get(handle);
      const message = errorMessage(err);
      const isHandleCollision = /already exists/i.test(message);
      if (isHandleCollision && existingId) {
        categoryCache.set(key, existingId);
        return existingId;
      }
      throw err;
    }
  }

  // -------------------------------------------------------------------------
  // 4. Import each row.
  // -------------------------------------------------------------------------
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const title = row.Name?.trim();
    const rowLabel = `${row.SKU || "?"} / ${title || "(untitled)"}`;

    try {
      if (!title) {
        logger.warn(`Skipping row with no Name (SKU ${row.SKU}).`);
        skipped++;
        continue;
      }

      if (row.Type && row.Type.trim() !== "simple") {
        logger.warn(
          `Skipping "${rowLabel}": unsupported product type "${row.Type}" (only "simple" is supported).`
        );
        skipped++;
        continue;
      }

      const handle = deriveHandle(row);
      if (existingHandles.has(handle)) {
        logger.info(`Skipping "${rowLabel}": handle "${handle}" already exists.`);
        skipped++;
        continue;
      }

      const regular = parseFloat(row["Regular price"]);
      const sale = row["Sale price"] ? parseFloat(row["Sale price"]) : NaN;
      const onSale = !isNaN(sale) && sale > 0 && sale < regular;
      const currentPrice = onSale ? sale : regular;
      if (isNaN(currentPrice) || currentPrice <= 0) {
        logger.warn(`Skipping "${rowLabel}": no valid price.`);
        skipped++;
        continue;
      }

      // Categories: "A > B, C, D > E" -> creates/reuses A, B (child of A), C,
      // D, E (child of D); the product links to each entry's leaf (B, C, E).
      const categoryIds: string[] = [];
      for (const entry of (row.Categories || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)) {
        const segments = entry
          .split(">")
          .map((s) => s.trim())
          .filter(Boolean);
        let parentId: string | undefined;
        let leafId: string | undefined;
        for (const segment of segments) {
          leafId = await getOrCreateCategory(segment, parentId);
          parentId = leafId;
        }
        if (leafId && !categoryIds.includes(leafId)) categoryIds.push(leafId);
      }

      const { features, extra } = parseFeaturesAndExtra(
        row["Short description"]
      );
      const longDescription = htmlBlockToPlainText(row["Description"]);
      const description =
        [longDescription, extra].filter(Boolean).join("\n\n") || undefined;
      const material = features.find((f) => /^material$/i.test(f.title))
        ?.description;

      const images = (row.Images || "")
        .split(",")
        .map((s) => s.trim())
        .filter((u) => /^https?:\/\//.test(u))
        .map((url) => ({ url }));

      const weightG = row["Weight (kg)"]
        ? Math.round(parseFloat(row["Weight (kg)"]) * 1000)
        : undefined;
      const lengthCm = row["Length (mm)"]
        ? round1(parseFloat(row["Length (mm)"]) / 10)
        : undefined;
      const widthCm = row["Width (mm)"]
        ? round1(parseFloat(row["Width (mm)"]) / 10)
        : undefined;
      const heightCm = row["Height (mm)"]
        ? round1(parseFloat(row["Height (mm)"]) / 10)
        : undefined;

      const sku = row.SKU?.trim() || undefined;
      const status =
        row.Published === "1" ? ProductStatus.PUBLISHED : ProductStatus.DRAFT;
      const stockQty =
        row["In stock?"] === "1"
          ? Math.max(0, Math.floor(parseFloat(row.Stock || "0") || 0))
          : 0;

      const metadata: Record<string, string> = {
        source: "woocommerce",
        woo_id: row.ID,
      };
      if (onSale) metadata.original_price_aud = String(regular);

      const {
        result: [product],
      } = await createProductsWorkflow(container).run({
        input: {
          products: [
            {
              title,
              handle,
              description,
              status,
              material: material || undefined,
              weight: weightG,
              length: lengthCm,
              width: widthCm,
              height: heightCm,
              category_ids: categoryIds,
              images: images.length ? images : undefined,
              shipping_profile_id: shippingProfile.id,
              sales_channels: [{ id: salesChannel.id }],
              metadata,
              options: [
                { title: "Default option", values: ["Default option value"] },
              ],
              variants: [
                {
                  title: "Default variant",
                  sku,
                  material: material || undefined,
                  weight: weightG,
                  length: lengthCm,
                  width: widthCm,
                  height: heightCm,
                  options: { "Default option": "Default option value" },
                  prices: [
                    { amount: currentPrice, currency_code: CURRENCY_CODE },
                  ],
                },
              ],
            },
          ],
        },
      });

      for (const [i, feature] of features.entries()) {
        const createdFeature =
          await productFeatureModuleService.createProductFeatures({
            title: feature.title,
            description: feature.description,
            rank: i,
          });
        await link.create({
          [Modules.PRODUCT]: { product_id: product.id },
          [PRODUCT_FEATURE_MODULE]: { product_feature_id: createdFeature.id },
        });
      }

      try {
        const { data: variantData } = await query.graph({
          entity: "product_variant",
          fields: ["id", "inventory_items.inventory_item_id"],
          filters: { product_id: product.id },
        });
        const inventoryItemId =
          variantData[0]?.inventory_items?.[0]?.inventory_item_id;
        if (inventoryItemId) {
          await createInventoryLevelsWorkflow(container).run({
            input: {
              inventory_levels: [
                {
                  location_id: stockLocation.id,
                  inventory_item_id: inventoryItemId,
                  stocked_quantity: stockQty,
                },
              ],
            },
          });
        } else {
          logger.warn(
            `Created "${rowLabel}" but couldn't find its inventory item - set stock manually.`
          );
        }
      } catch (invErr) {
        logger.warn(
          `Created "${rowLabel}" but failed to set its stock level: ${errorMessage(
            invErr
          )}`
        );
      }

      existingHandles.add(handle);
      created++;
      logger.info(`Created "${rowLabel}" -> ${handle}`);
    } catch (err) {
      failed++;
      logger.error(`Failed to import "${rowLabel}": ${errorMessage(err)}`);
    }
  }

  logger.info(
    `Import finished. Created: ${created}, Skipped: ${skipped}, Failed: ${failed}.`
  );
}
