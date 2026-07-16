import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

/**
 * Contact-form inquiries. The public site can CREATE a lead (so the contact
 * form works without a login), but only dashboard users can read/edit them.
 * `channel` records how the inquiry arrived — form, WhatsApp, or email —
 * which matters for the Saudi/MENA market (plan Phase 10).
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  admin: {
    useAsTitle: 'name',
    group: 'Inbox',
    defaultColumns: ['name', 'channel', 'email', 'createdAt'],
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      name: 'channel',
      type: 'select',
      defaultValue: 'form',
      options: [
        { label: 'Website form', value: 'form' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Email', value: 'email' },
      ],
    },
  ],
}
