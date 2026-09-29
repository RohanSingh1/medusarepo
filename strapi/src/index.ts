import type { Core } from '@strapi/strapi';

// Content types the public storefront needs read access to. Only `find` and
// `findOne` are granted - this is read-only marketing content, never write
// access - so the storefront doesn't need an API token for these routes.
const PUBLIC_READABLE_SINGLE_TYPES = ['homepage'];
const PUBLIC_READABLE_COLLECTION_TYPES = [
  'why-us-reason',
  'inside-car-step',
  'testimonial',
  'journal-entry',
];

async function grantPublicReadAccess(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    return;
  }

  const grants: { contentType: string; actions: string[] }[] = [
    ...PUBLIC_READABLE_SINGLE_TYPES.map((contentType) => ({
      contentType,
      actions: ['find'],
    })),
    ...PUBLIC_READABLE_COLLECTION_TYPES.map((contentType) => ({
      contentType,
      actions: ['find', 'findOne'],
    })),
  ];

  for (const { contentType, actions } of grants) {
    for (const action of actions) {
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

const SEED_HOMEPAGE = {
  heroEyebrow: 'Fragrance, Engineered',
  heroHeadlineLine1: 'A Signature Scent',
  heroHeadlineLine2: 'for Every Drive',
  heroSubcopy:
    'Seven fragrances composed for the cabin. Hand-blended oils, a machined glass vessel, and a diffusion system tuned to the air of a moving car.',
  heroPrimaryCtaLabel: 'Explore the Collection',
  heroPrimaryCtaHref: '/store',
  storyEyebrow: 'Our Story',
  storyHeadline: 'The cabin is the last room nobody designed a scent for.',
  storyBody1:
    'A car interior is a small, sealed, temperature-swinging space. Most air fresheners were built for it by accident. We started the other way round, with perfumers who usually work on fine fragrance, and asked what a composition needs to survive forty degrees of heat and a closed door.',
  storyBody2:
    'The answer was heavier bases, fewer volatile tops, and a diffusion rate slow enough that you stop noticing it and start missing it when it is gone.',
  storyTags: ['Blended in Grasse', 'IFRA compliant', 'Refillable vessel'],
  collectionEyebrow: 'The Collection',
  collectionHeadline: 'Seven compositions',
  collectionIntro:
    'Each one is a complete fragrance, not a variant. Pick by the drive you take most.',
  collectionFinderHeading: 'Find the one that suits your drive',
  collectionFinderQuestions: [
    'Where you drive',
    'Your cabin size',
    'Scents you already wear',
  ],
  collectionFinderCtaLabel: 'Discover your scent →',
  ctaBannerHeadline: 'Make Every Drive Memorable',
  ctaBannerBody:
    'Complimentary express delivery. Ninety-day satisfaction guarantee on every bottle.',
  ctaBannerButtonLabel: 'Shop the Collection',
  ctaBannerButtonHref: '/store',
};

const SEED_WHY_US_REASONS = [
  {
    icon: 'Clock',
    title: 'Long-Lasting Fragrance',
    description:
      'Up to 100 days from one bottle. Heavier base molecules survive cabin heat.',
    order: 0,
  },
  {
    icon: 'Droplet',
    title: 'Premium Ingredients',
    description: 'Fine-fragrance oils, no alcohol carrier, IFRA compliant.',
    order: 1,
  },
  {
    icon: 'Sparkles',
    title: 'Elegant Design',
    description:
      'Machined cap, weighted glass, refillable body. Made to be seen on a console.',
    order: 2,
  },
  {
    icon: 'ShieldCheck',
    title: 'Easy Installation',
    description:
      'Three steps, under a minute, no tools. Fits horizontal and vertical vents.',
    order: 3,
  },
  {
    icon: 'Wind',
    title: 'Adjustable Intensity',
    description: 'A three-position collar sets how much air reaches the wick.',
    order: 4,
  },
  {
    icon: 'Car',
    title: 'Made for Cars',
    description:
      'Tested from minus 10 to 60 degrees. Sealed against spill, stable in sunlight.',
    order: 5,
  },
] as const;

const SEED_INSIDE_CAR_STEPS = [
  {
    stepNumber: '01',
    title: 'Vent mount',
    body: 'A weighted stainless clip grips the blade without rattling. Rotates 30 degrees so the bottle stays level on any vent angle.',
    pinTop: '38%',
    pinLeft: '24%',
    order: 0,
  },
  {
    stepNumber: '02',
    title: 'Intensity collar',
    body: 'Three positions control the aperture. Turn down in winter when the heater carries scent further, up in summer.',
    pinTop: '62%',
    pinLeft: '55%',
    order: 1,
  },
  {
    stepNumber: '03',
    title: 'Sealed reservoir',
    body: 'No spill, no leak, no evaporation when parked. The wick draws only when air moves across it.',
    pinTop: '28%',
    pinLeft: '76%',
    order: 2,
  },
];

const SEED_TESTIMONIALS = [
  {
    name: 'Daniel R.',
    location: 'Noir, verified buyer',
    quote:
      'I have had three cars detailed by the same studio and none of them smelled like this. Noir lasted the full quarter in a Range Rover.',
    rating: 5,
    order: 0,
  },
  {
    name: 'Priya S.',
    location: 'Aqua, verified buyer',
    quote:
      'Bought Aqua for a weekend car that always smelled closed up. It is the first thing passengers mention now.',
    rating: 5,
    order: 1,
  },
  {
    name: 'Marcus T.',
    location: 'Oud, verified buyer',
    quote:
      'The price made me hesitate. Three months later the bottle is still going and the cabin still smells composed, not sprayed.',
    rating: 5,
    order: 2,
  },
  {
    name: 'Elena K.',
    location: 'Velvet, verified buyer',
    quote:
      'Install took under a minute and the vent clip does not rattle, which was my main worry.',
    rating: 5,
    order: 3,
  },
];

const SEED_JOURNAL_ENTRIES = [
  {
    category: 'Craft',
    title: 'Why cabin heat destroys most fragrance',
    accentColor: '#6B5B43',
    order: 0,
  },
  {
    category: 'Guides',
    title: 'Matching a scent to your interior',
    accentColor: '#14708F',
    order: 1,
  },
  {
    category: 'Studio',
    title: 'Three days in Grasse with our perfumer',
    accentColor: '#8A5A17',
    order: 2,
  },
];

async function seedHomepage(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::homepage.homepage').findFirst({});
  if (existing) {
    return;
  }

  await strapi.documents('api::homepage.homepage').create({
    data: SEED_HOMEPAGE,
    status: 'published',
  });

  strapi.log.info('Seeded homepage content.');
}

async function seedWhyUsReasons(strapi: Core.Strapi) {
  const count = await strapi.documents('api::why-us-reason.why-us-reason').count({});
  if (count > 0) {
    return;
  }

  for (const reason of SEED_WHY_US_REASONS) {
    await strapi.documents('api::why-us-reason.why-us-reason').create({
      data: reason,
      status: 'published',
    });
  }

  strapi.log.info(`Seeded ${SEED_WHY_US_REASONS.length} why-us reason(s).`);
}

async function seedInsideCarSteps(strapi: Core.Strapi) {
  const count = await strapi.documents('api::inside-car-step.inside-car-step').count({});
  if (count > 0) {
    return;
  }

  for (const step of SEED_INSIDE_CAR_STEPS) {
    await strapi.documents('api::inside-car-step.inside-car-step').create({
      data: step,
      status: 'published',
    });
  }

  strapi.log.info(`Seeded ${SEED_INSIDE_CAR_STEPS.length} inside-car step(s).`);
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

async function seedJournalEntries(strapi: Core.Strapi) {
  const count = await strapi.documents('api::journal-entry.journal-entry').count({});
  if (count > 0) {
    return;
  }

  for (const entry of SEED_JOURNAL_ENTRIES) {
    await strapi.documents('api::journal-entry.journal-entry').create({
      data: entry,
      status: 'published',
    });
  }

  strapi.log.info(`Seeded ${SEED_JOURNAL_ENTRIES.length} journal entry/entries.`);
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicReadAccess(strapi);
    await seedHomepage(strapi);
    await seedWhyUsReasons(strapi);
    await seedInsideCarSteps(strapi);
    await seedTestimonials(strapi);
    await seedJournalEntries(strapi);
  },
};
