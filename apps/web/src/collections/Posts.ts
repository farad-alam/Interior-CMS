import type { CollectionConfig } from 'payload'

import { seoField } from '../fields/seo'
import { generateSlug } from '../hooks/generateSlug'

/** Blog / articles. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'publishedDate', 'published'],
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
      admin: { description: 'Auto-filled from the title if left blank.' },
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'publishedDate', type: 'date' },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Visible on the live site.' },
    },
    seoField,
  ],
}
