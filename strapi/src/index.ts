import type { Core } from '@strapi/strapi';

// Strapi is no longer used by the storefront - AURA's homepage content
// (hero copy, why-us reasons, testimonials) is hardcoded directly in the
// Next.js components, matching the design reference (which has no CMS
// integration at all - everything comes from its own static JS data). The
// hero-slide/why-us-item/testimonial content-types and their seed data have
// been removed accordingly.

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},
  async bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
