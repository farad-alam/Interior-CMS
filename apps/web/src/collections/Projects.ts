import type { CollectionConfig } from 'payload'

import { seoField } from '../fields/seo'
import { generateSlug } from '../hooks/generateSlug'

/**
 * The core content type for an interior-design site. Its shape mirrors the
 * `ProjectSchema` Zod contract in `packages/cms-client` — every Portfolio
 * component variant is built against that same shape, which is what makes
 * the variants interchangeable (see plan Phase 2 & Phase 7).
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'featured', 'published'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [generateSlug('title')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Auto-filled from the title if left blank. e.g. "riyadh-villa".' },
    },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'description', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text' },
        { name: 'year', type: 'number' },
        { name: 'client', type: 'text' },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    {
      type: 'collapsible',
      label: 'Before / After',
      admin: { initCollapsed: true },
      fields: [
        { name: 'beforeImage', type: 'upload', relationTo: 'media' },
        { name: 'afterImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'video',
      type: 'text',
      admin: {
        description: 'YouTube/Vimeo link for long reels, or a Cloudinary video URL.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show on the homepage.' },
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Visible on the live site.' },
        },
      ],
    },
    seoField,
  ],
}
