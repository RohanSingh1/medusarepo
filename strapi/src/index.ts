import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import type { Core } from '@strapi/strapi';

// Content types the public storefront needs read access to. Only `find` and
// `findOne` are granted - this is read-only marketing content, never write
// access - so the storefront doesn't need an API token for these routes.
const PUBLIC_READABLE_CONTENT_TYPES = ['hero-slide', 'why-us-item', 'testimonial'];
const PUBLIC_READABLE_ACTIONS = ['find', 'findOne'];

async function grantPublicReadAccess(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    return;
  }

  for (const contentType of PUBLIC_READABLE_CONTENT_TYPES) {
    for (const action of PUBLIC_READABLE_ACTIONS) {
      const actionId = `api::${contentType}.${contentType}.${action}`;

      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: actionId, role: publicRole.id } });

      if (!existing) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: actionId, role: publicRole.id },
        });
      }
    }
  }
}

const SEED_HERO_SLIDES = [
  {
    eyebrow: 'Outdoor & Pool Tiles',
    title: 'Outdoor Tiles Built to Last',
    subtitle:
      "Anti-slip porcelain for alfresco areas, balconies and pool surrounds.",
    ctaLabel: 'Shop Outdoor Tiles',
    ctaHref: '/store',
    order: 0,
    imageUrl:
      'https://staging.tfo.com.au/wp-content/uploads/1970/01/5711.jpg',
  },
  {
    eyebrow: 'Large Format Porcelain',
    title: 'Factory Direct Prices, Every Day',
    subtitle:
      "Skip the middleman. The same premium tiles, at Sydney's lowest outlet prices.",
    ctaLabel: 'Shop All Tiles',
    ctaHref: '/store',
    order: 1,
    imageUrl:
      'https://staging.tfo.com.au/wp-content/uploads/Arezzo-Perla-Glazed-Matt-Spanish-Porcelain-Tile-1.jpg',
  },
  {
    eyebrow: 'Pool Mosaics',
    title: 'Transform Your Pool',
    subtitle: 'Spanish glass mosaics designed for pool floors and waterlines.',
    ctaLabel: 'Shop Pool Mosaics',
    ctaHref: '/store',
    order: 2,
    imageUrl:
      'https://staging.tfo.com.au/wp-content/uploads/pearl-blue-silicone-joined-spanish-pool-mosaic-tile-1.jpg',
  },
  {
    eyebrow: 'Natural Stone',
    title: 'Marble & Natural Stone',
    subtitle:
      'Bring timeless texture to bathrooms, splashbacks and feature walls.',
    ctaLabel: 'Shop Natural Stone',
    ctaHref: '/store',
    order: 3,
    imageUrl:
      'https://staging.tfo.com.au/wp-content/uploads/bianco-carrara-arabesque-polished-marble-mosaic-sheet-1.jpg',
  },
];

const SEED_WHY_US_ITEMS = [
  {
    icon: 'HandCoins',
    title: 'Lowest Outlet Prices',
    description:
      'Factory-direct buying power means genuine outlet prices on every tile, every day.',
    order: 0,
  },
  {
    icon: 'Boxes',
    title: 'Huge Range In Stock',
    description:
      'Hundreds of porcelain, ceramic, natural stone and mosaic ranges ready to ship.',
    order: 1,
  },
  {
    icon: 'Truck',
    title: 'Fast Sydney-Wide Delivery',
    description: 'Order online and get your tiles delivered to your door or job site.',
    order: 2,
  },
  {
    icon: 'ShieldCheck',
    title: 'Expert Advice',
    description:
      'Our team can help you pick the right tile, finish and quantity for your project.',
    order: 3,
  },
] as const;

const SEED_TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'Parramatta, NSW',
    quote:
      'Incredible range and the prices were much better than the big box stores. The team helped us pick the right anti-slip tile for our pool area.',
    rating: 5,
    order: 0,
  },
  {
    name: 'David K.',
    location: 'Liverpool, NSW',
    quote:
      'Ordered a large format porcelain for our living area - arrived well packed and on time. Will be back for the bathroom reno.',
    rating: 5,
    order: 1,
  },
  {
    name: 'Priya R.',
    location: 'Blacktown, NSW',
    quote:
      'Great advice over the phone about quantities and wastage. Saved us from over-ordering and the tiles look fantastic.',
    rating: 4,
    order: 2,
  },
];

async function uploadImageFromUrl(
  strapi: Core.Strapi,
  imageUrl: string,
  fileName: string
): Promise<number | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    const tmpPath = path.join(os.tmpdir(), fileName);
    await fs.writeFile(tmpPath, buffer);

    const [uploadedFile] = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        data: {},
        files: {
          filepath: tmpPath,
          originalFilename: fileName,
          mimetype: mimeType,
          size: buffer.byteLength,
        },
      });

    await fs.unlink(tmpPath).catch(() => {});

    return uploadedFile.id;
  } catch (err) {
    strapi.log.warn(
      `Seed: failed to fetch/upload hero slide image "${imageUrl}": ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return null;
  }
}

async function seedHeroSlides(strapi: Core.Strapi) {
  const count = await strapi.documents('api::hero-slide.hero-slide').count({});
  if (count > 0) {
    return;
  }

  for (const slide of SEED_HERO_SLIDES) {
    const { imageUrl, ...data } = slide;
    const fileName = imageUrl.split('/').pop() || 'hero-slide.jpg';
    const imageId = await uploadImageFromUrl(strapi, imageUrl, fileName);

    await strapi.documents('api::hero-slide.hero-slide').create({
      data: { ...data, ...(imageId ? { image: imageId } : {}) },
      status: 'published',
    });
  }

  strapi.log.info(`Seeded ${SEED_HERO_SLIDES.length} hero slide(s).`);
}

async function seedWhyUsItems(strapi: Core.Strapi) {
  const count = await strapi.documents('api::why-us-item.why-us-item').count({});
  if (count > 0) {
    return;
  }

  for (const item of SEED_WHY_US_ITEMS) {
    await strapi.documents('api::why-us-item.why-us-item').create({
      data: item,
      status: 'published',
    });
  }

  strapi.log.info(`Seeded ${SEED_WHY_US_ITEMS.length} why-us item(s).`);
}

async function seedTestimonials(strapi: Core.Strapi) {
  const count = await strapi.documents('api::testimonial.testimonial').count({});
  if (count > 0) {
    return;
  }

  for (const testimonial of SEED_TESTIMONIALS) {
    await strapi.documents('api::testimonial.testimonial').create({
      data: testimonial,
      status: 'published',
    });
  }

  strapi.log.info(`Seeded ${SEED_TESTIMONIALS.length} testimonial(s).`);
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicReadAccess(strapi);
    await seedHeroSlides(strapi);
    await seedWhyUsItems(strapi);
    await seedTestimonials(strapi);
  },
};
