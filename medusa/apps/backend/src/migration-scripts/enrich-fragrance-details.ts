import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createProductTypesWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";

// Fills in the physical product-spec fields (material, origin, weight,
// dimensions, product type) that reset-to-perfume-catalog.ts left blank, and
// replaces each fragrance's short one-line description with a fuller one
// built from its existing mood/smell/notes metadata. Safe to re-run - it
// always overwrites with the same fixed content below.
//
// Usage: npx medusa exec ./src/migration-scripts/enrich-fragrance-details.ts

const PRODUCT_TYPE_VALUE = "Car Fragrance Diffuser";

// Shared physical spec for every AURA vessel - one consistent bottle across
// the range, per the site's own copy ("the same weighted glass vessel and
// machined aluminium cap as every AURA fragrance").
const SHARED_SPEC = {
  material: "Weighted glass vessel, brushed aluminium cap, stainless steel vent clip",
  origin_country: "France",
  weight: 85, // grams
  length: 4, // cm
  width: 4, // cm
  height: 9, // cm
};

const DESCRIPTIONS: Record<string, string> = {
  noir: "Noir is composed for late drives and long motorways, when the cabin should feel like a private members' club rather than a commute. It opens dry and dark - black pepper, bergamot, and smoked incense - before settling into tanned leather, amber, and tobacco leaf within the first minute. The base of Cambodian oud, vetiver, and musk holds its shape for up to 90 days at a balanced intensity, with nothing sweet or perfumed about it. Like every AURA fragrance, it ships in a weighted glass vessel with a machined aluminium cap and a stainless vent clip that stays silent at speed.",
  aqua: "Aqua is built for morning commutes and cars that need to feel freshly detailed every time the door opens. It's bright and wet at first - Sicilian lemon, sea salt, and grapefruit - before turning clean and faintly mineral through a heart of marine accord, violet leaf, and rosemary. White musk, driftwood, and ambergris keep it settled for around 85 days at balanced intensity, though the citrus top softens after the sixth week. Housed in the same weighted glass vessel and machined aluminium cap as every AURA fragrance, with a stainless vent clip built to stay quiet at speed.",
  oud: "Oud is the richest composition in the range - dense, resinous, and the most noticeable of the seven from outside the car. Saffron, cardamom, and pink pepper open into a heart of rose absolute, sandalwood, and cedar, before settling on a base of Laotian oud, amber resin, and benzoin that holds for up to 100 days at balanced intensity, longer than any other AURA fragrance thanks to its heavier molecules. Sweet at the edges but never sharp. Ships in the same weighted glass vessel and machined aluminium cap as every AURA fragrance, with a stainless vent clip that stays silent at speed.",
  citrus: "Citrus is the cleanest wake-up in the collection and the easiest to live with daily. Cold-pressed Amalfi lemon, blood orange, and bergamot sit almost directly on a heart of neroli, petitgrain, and green mandarin, with only a light base of cedarwood, light musk, and ginger underneath. Sharp, sunny, and dry rather than sweet - closer to a cold glass of citrus than a dessert. The trade-off for that brightness is a shorter life than the rest of the range, around 70 days at balanced intensity, since peel oils are volatile by nature. Ships in the same weighted glass vessel and machined aluminium cap as every AURA fragrance.",
  velvet: "Velvet is made for evening drives and cold weather, when the cabin should feel warm rather than fresh. Turkish rose, raspberry, and pink pepper open into a powdery heart of peony, orris root, and jasmine, before settling into bourbon vanilla, tonka bean, and soft musk. Warm and quiet rather than loud - it sits close instead of filling the cabin, and holds its shape through a full winter of heating at up to 90 days on balanced intensity. Ships in the same weighted glass vessel and machined aluminium cap as every AURA fragrance, with a stainless vent clip that stays silent at speed.",
  forest: "Forest is designed to make a cabin feel like open air rather than an interior. Scots pine, juniper, and eucalyptus open cool and green, moving into a heart of cedar, cypress, and fir balsam, before settling on oakmoss, vetiver, and wet stone - slightly damp, like air after rain in the hills. It holds at a balanced intensity for around 88 days. Ships in the same weighted glass vessel and machined aluminium cap as every AURA fragrance, with a stainless vent clip that stays silent at speed.",
  ice: "Ice is at its best in summer traffic, when most fragrances turn cloying in the heat. Peppermint, eucalyptus, and frozen citrus open cold and sharp, flattening into a heart of silver fir, mineral accord, and iris, then a clean base of white musk, white amber, and cashmere wood. Near-scentless by design rather than by accident, it holds at balanced intensity for around 80 days. Ships in the same weighted glass vessel and machined aluminium cap as every AURA fragrance, with a stainless vent clip that stays silent at speed.",
};

export default async function enrichFragranceDetails({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "type_id"],
    filters: { handle: Object.keys(DESCRIPTIONS) },
  });

  if (!products.length) {
    logger.warn("No fragrance products found - nothing to enrich.");
    return;
  }

  let typeId = products.find((p) => p.type_id)?.type_id ?? null;

  if (!typeId) {
    const { data: existingTypes } = await query.graph({
      entity: "product_type",
      fields: ["id", "value"],
      filters: { value: PRODUCT_TYPE_VALUE },
    });

    if (existingTypes.length) {
      typeId = existingTypes[0].id;
    } else {
      const { result: createdTypes } = await createProductTypesWorkflow(
        container
      ).run({
        input: { product_types: [{ value: PRODUCT_TYPE_VALUE }] },
      });
      typeId = createdTypes[0].id;
      logger.info(`Created product type "${PRODUCT_TYPE_VALUE}".`);
    }
  }

  await updateProductsWorkflow(container).run({
    input: {
      products: products.map((p) => ({
        id: p.id,
        type_id: typeId!,
        description: DESCRIPTIONS[p.handle] ?? undefined,
        ...SHARED_SPEC,
      })),
    },
  });

  logger.info(`Enriched details for ${products.length} fragrance product(s).`);
}
