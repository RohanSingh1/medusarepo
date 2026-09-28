import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils";
import {
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
  deleteProductsWorkflow,
  deleteProductCategoriesWorkflow,
  cancelOrderWorkflow,
} from "@medusajs/medusa/core-flows";

// Full catalog reset: TFO (tiles) -> AURA (car cabin fragrance), per explicit
// client instruction to pivot the business. Deletes every existing product
// and category, then seeds the 7-fragrance AURA range from the design
// reference. Keeps the store's region/sales-channel/stock-location/shipping-
// profile/collection setup as-is - those aren't business-specific.
//
// Usage: npx medusa exec ./src/migration-scripts/reset-to-perfume-catalog.ts

const CURRENCY_CODE = "aud";
const PRICE = 69; // AUD - AURA's own $1500 USD figure is a design-mock
// placeholder for an ~8ml car fragrance vessel; this is a realistic price
// for the real product.
const STOCK_PER_VARIANT = 50;
const INTENSITIES = ["Subtle", "Balanced", "Intense"];

type Fragrance = {
  id: string;
  name: string;
  tagline: string;
  mood: string;
  desc: string;
  smell: string;
  lasts: string;
  accent: string;
  soft: string;
  tint: string;
  top: string[];
  heart: string[];
  base: string[];
};

const FRAGRANCES: Fragrance[] = [
  {
    id: "noir",
    name: "Noir",
    tagline: "Leather, amber, oud",
    mood: "Luxury executive car",
    desc: "Composed for late drives and long motorways. Tanned leather over smoked amber, with oud holding the base steady for weeks.",
    smell:
      "Dry and dark. It opens with pepper and smoke, then settles into leather within the first minute. Nothing sweet.",
    lasts:
      "90 days at balanced intensity in a mid-size cabin. Around 60 days on high.",
    accent: "#6B5B43",
    soft: "#2a2318",
    tint: "#F0EAE2",
    top: ["Black pepper", "Bergamot", "Smoked incense"],
    heart: ["Tanned leather", "Amber", "Tobacco leaf"],
    base: ["Cambodian oud", "Vetiver", "Musk"],
  },
  {
    id: "aqua",
    name: "Aqua",
    tagline: "Ocean, citrus, musk",
    mood: "Fresh and clean",
    desc: "Salt air and cold citrus. Built for morning commutes and cars that need to feel just-detailed every time you open the door.",
    smell:
      "Bright and wet at first, then clean and slightly mineral. Reads as fresh rather than perfumed.",
    lasts: "85 days at balanced intensity. Citrus top notes soften after week six.",
    accent: "#14708F",
    soft: "#07293d",
    tint: "#E6EFF3",
    top: ["Sicilian lemon", "Sea salt", "Grapefruit"],
    heart: ["Marine accord", "Violet leaf", "Rosemary"],
    base: ["White musk", "Driftwood", "Ambergris"],
  },
  {
    id: "oud",
    name: "Oud",
    tagline: "Oud, sandalwood, amber",
    mood: "Rich and sophisticated",
    desc: "The richest blend in the range. Resinous oud layered over creamy sandalwood, warmed with amber and a trace of saffron.",
    smell:
      "Dense and resinous. Sweet at the edges, never sharp. The most noticeable of the seven from outside the car.",
    lasts: "100 days at balanced intensity. The heaviest molecules hold longest.",
    accent: "#8A5A17",
    soft: "#2b1d0c",
    tint: "#F5ECDE",
    top: ["Saffron", "Cardamom", "Pink pepper"],
    heart: ["Rose absolute", "Sandalwood", "Cedar"],
    base: ["Laotian oud", "Amber resin", "Benzoin"],
  },
  {
    id: "citrus",
    name: "Citrus",
    tagline: "Lemon, bergamot, orange",
    mood: "Energetic and refreshing",
    desc: "Cold-pressed peel oils with almost no base. The cleanest wake-up in the collection, and the easiest to live with daily.",
    smell: "Sharp, sunny and dry. Closer to a cold glass of citrus than a dessert.",
    lasts: "70 days at balanced intensity. Peel oils are volatile by nature.",
    accent: "#A67908",
    soft: "#3a2a06",
    tint: "#FAF3DB",
    top: ["Amalfi lemon", "Blood orange", "Bergamot"],
    heart: ["Neroli", "Petitgrain", "Green mandarin"],
    base: ["Cedarwood", "Light musk", "Ginger"],
  },
  {
    id: "velvet",
    name: "Velvet",
    tagline: "Rose, vanilla, musk",
    mood: "Warm and elegant",
    desc: "Turkish rose softened with bourbon vanilla. Warm, powdery and quiet, made for evening drives and cold weather.",
    smell:
      "Floral and warm with a powdered finish. Sits close rather than filling the cabin.",
    lasts: "90 days at balanced intensity. Holds its shape through winter heating.",
    accent: "#8E2F4C",
    soft: "#33081a",
    tint: "#F7E4EA",
    top: ["Turkish rose", "Raspberry", "Pink pepper"],
    heart: ["Peony", "Orris root", "Jasmine"],
    base: ["Bourbon vanilla", "Tonka bean", "Soft musk"],
  },
  {
    id: "forest",
    name: "Forest",
    tagline: "Pine, cedar, moss",
    mood: "Natural and calming",
    desc: "Damp pine and cut cedar over forest floor. Designed to make a cabin feel like open air rather than an interior.",
    smell: "Green, resinous and cool. Slightly damp, like air after rain in the hills.",
    lasts: "88 days at balanced intensity.",
    accent: "#2F6B48",
    soft: "#0d2618",
    tint: "#E7F0E9",
    top: ["Scots pine", "Juniper", "Eucalyptus"],
    heart: ["Cedar", "Cypress", "Fir balsam"],
    base: ["Oakmoss", "Vetiver", "Wet stone"],
  },
  {
    id: "ice",
    name: "Ice",
    tagline: "Mint, eucalyptus, clean musk",
    mood: "Cool and refreshing",
    desc: "A cold, almost clinical clarity. Mint and eucalyptus over transparent musk, at its best in summer traffic.",
    smell:
      "Cold on the first breath. Sharp mint that flattens into a clean, near-scentless dryness.",
    lasts: "80 days at balanced intensity.",
    accent: "#3E7C91",
    soft: "#12303c",
    tint: "#E9F2F5",
    top: ["Peppermint", "Eucalyptus", "Frozen citrus"],
    heart: ["Silver fir", "Mineral accord", "Iris"],
    base: ["Clean musk", "White amber", "Cashmere wood"],
  },
];

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return String(err);
}

export default async function resetToPerfumeCatalog({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // -------------------------------------------------------------------------
  // 1. Wipe every existing product + category.
  // -------------------------------------------------------------------------
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
    pagination: { take: 1000 },
  });

  if (existingProducts.length) {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "status"],
    });
    for (const order of orders) {
      if (order.status !== "canceled") {
        try {
          await cancelOrderWorkflow(container).run({
            input: { order_id: order.id },
          });
          logger.info(`Canceled order #${order.display_id}.`);
        } catch (err) {
          logger.warn(
            `Could not cancel order #${order.display_id}: ${errorMessage(err)}`
          );
        }
      }
    }

    await deleteProductsWorkflow(container).run({
      input: { ids: existingProducts.map((p) => p.id) },
    });
    logger.info(`Deleted ${existingProducts.length} existing product(s).`);
  }

  // Categories form a tree and Medusa refuses to delete a parent while it
  // still has children, so delete leaf-first in passes until none remain.
  let deletedCategoryCount = 0;
  for (let pass = 0; pass < 10; pass++) {
    const { data: remaining } = await query.graph({
      entity: "product_category",
      fields: ["id", "category_children.id"],
      pagination: { take: 1000 },
    });
    if (!remaining.length) break;

    const leafIds = remaining
      .filter((c) => !c.category_children?.length)
      .map((c) => c.id);
    if (!leafIds.length) break;

    await deleteProductCategoriesWorkflow(container).run({ input: leafIds });
    deletedCategoryCount += leafIds.length;
  }
  if (deletedCategoryCount) {
    logger.info(`Deleted ${deletedCategoryCount} existing categor(y/ies).`);
  }

  // -------------------------------------------------------------------------
  // 2. Reuse the existing sales channel / stock location / shipping profile /
  //    "featured" collection.
  // -------------------------------------------------------------------------
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
  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
  });

  const salesChannel = salesChannels[0];
  const stockLocation = stockLocations[0];
  const shippingProfile = shippingProfiles[0];
  const featuredCollection = collections.find((c) => c.handle === "featured");

  if (!salesChannel || !stockLocation || !shippingProfile) {
    logger.error(
      "Missing base store setup (sales channel / stock location / shipping profile)."
    );
    return;
  }

  // -------------------------------------------------------------------------
  // 3. Create the 7 fragrances, each with Subtle/Balanced/Intense variants.
  // -------------------------------------------------------------------------
  for (const fragrance of FRAGRANCES) {
    try {
      const { result: [product] } = await createProductsWorkflow(container).run({
        input: {
          products: [
            {
              title: fragrance.name,
              handle: fragrance.id,
              description: fragrance.desc,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              sales_channels: [{ id: salesChannel.id }],
              ...(featuredCollection
                ? { collection_id: featuredCollection.id }
                : {}),
              metadata: {
                tagline: fragrance.tagline,
                mood: fragrance.mood,
                smell: fragrance.smell,
                lasts: fragrance.lasts,
                accent: fragrance.accent,
                soft: fragrance.soft,
                tint: fragrance.tint,
                top_notes: fragrance.top.join(", "),
                heart_notes: fragrance.heart.join(", "),
                base_notes: fragrance.base.join(", "),
              },
              options: [{ title: "Intensity", values: INTENSITIES }],
              variants: INTENSITIES.map((intensity) => ({
                title: intensity,
                sku: `AURA-${fragrance.id.toUpperCase()}-${intensity.toUpperCase()}`,
                options: { Intensity: intensity },
                prices: [{ amount: PRICE, currency_code: CURRENCY_CODE }],
              })),
            },
          ],
        },
      });

      const { data: variantData } = await query.graph({
        entity: "product_variant",
        fields: ["id", "inventory_items.inventory_item_id"],
        filters: { product_id: product.id },
      });

      const levels = variantData
        .map((v) => v.inventory_items?.[0]?.inventory_item_id)
        .filter((id): id is string => !!id)
        .map((inventory_item_id) => ({
          location_id: stockLocation.id,
          inventory_item_id,
          stocked_quantity: STOCK_PER_VARIANT,
        }));

      if (levels.length) {
        await createInventoryLevelsWorkflow(container).run({
          input: { inventory_levels: levels },
        });
      }

      logger.info(`Created "${fragrance.name}" (${levels.length} variant(s)).`);
    } catch (err) {
      logger.error(`Failed to create "${fragrance.name}": ${errorMessage(err)}`);
    }
  }

  logger.info("Perfume catalog reset finished.");
}
