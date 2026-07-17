import type { GlobalConfig } from 'payload'

import { seoField } from '../fields/seo'
import { revalidateSite } from '../hooks/revalidateSite'

/**
 * Site-wide branding & configuration a client can edit without touching code:
 * logo, brand color, WhatsApp number, socials, and default SEO. This is what
 * lets one codebase be re-skinned per client (plan Phase 8 / Phase 13).
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, localized: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'heroVariant',
      type: 'select',
      defaultValue: 'hero01',
      required: true,
      admin: {
        description: 'Choose the homepage hero layout. The content below is used by both.',
      },
      options: [
        { label: 'Full-bleed image (Hero 01)', value: 'hero01' },
        { label: 'Split — text beside image (Hero 02)', value: 'hero02' },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      admin: { description: 'The big first section on the homepage.' },
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'subheadline', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'ctaLabel', type: 'text', localized: true, defaultValue: 'Get a free consultation' },
      ],
    },
    {
      name: 'about',
      type: 'group',
      admin: { description: 'Content for the /about page.' },
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'primaryColor',
      type: 'text',
      defaultValue: '#111111',
      admin: { description: 'Brand color as a hex value, e.g. #C9A227.' },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      admin: { description: 'International format with no "+", e.g. 9665XXXXXXXX.' },
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'x', type: 'text' },
      ],
    },
    seoField,
  ],
}
