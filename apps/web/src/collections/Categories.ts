import type { CollectionConfig } from 'payload'

import { generateSlug } from '../hooks/generateSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Project categories, e.g. Living Room, Kitchen, Majlis.',
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
      admin: { description: 'Auto-filled from the title if left blank. e.g. "living-room".' },
    },
  ],
}
