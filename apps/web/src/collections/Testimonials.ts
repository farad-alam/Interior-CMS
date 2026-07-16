import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'company', 'rating'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'review', type: 'textarea', required: true, localized: true },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: { description: '1 to 5 stars.' },
    },
  ],
}
