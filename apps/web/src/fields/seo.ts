import type { Field } from 'payload'

/**
 * Shared SEO group reused by every page-like collection (Projects, Posts,
 * plus the SiteSettings global for site-wide defaults). Kept in one place
 * so the SEO shape stays identical everywhere — the frontend can read it
 * the same way no matter which collection it came from.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: {
    description: 'Search-engine title & description for this item.',
  },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}
