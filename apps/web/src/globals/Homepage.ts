import type { Block, Field, GlobalConfig } from 'payload'

import { revalidateSite } from '../hooks/revalidateSite'

/**
 * Home Page Builder (plan Phase 9). A `blocks` field lets a client add,
 * remove, reorder, and pick a layout variant for each homepage section — all
 * from the dashboard, no code. Each block only holds presentation choices
 * (which section, which variant); the actual content still lives in its
 * collection/global, so content stays separate from layout.
 *
 * Add a new variant option here as new variant components get built.
 */
const variant = (options: { label: string; value: string }[]): Field => ({
  name: 'variant',
  type: 'select',
  defaultValue: options[0].value,
  required: true,
  admin: { description: 'Which layout to use for this section.' },
  options,
})

const section = (
  slug: string,
  label: string,
  variants: { label: string; value: string }[],
): Block => ({
  slug,
  labels: { singular: label, plural: label },
  fields: [variant(variants)],
})

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Home Page Builder',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  fields: [
    {
      name: 'sections',
      type: 'blocks',
      labels: { singular: 'Section', plural: 'Sections' },
      admin: {
        description:
          'Build the homepage: add sections, drag to reorder, remove any you don’t want, and choose a variant for each. Leave empty to use the default layout.',
      },
      blocks: [
        section('hero', 'Hero', [
          { label: 'Full-bleed image (01)', value: 'hero01' },
          { label: 'Split — text beside image (02)', value: 'hero02' },
        ]),
        section('services', 'Services', [{ label: 'Default (01)', value: 'services01' }]),
        section('projects', 'Projects', [{ label: 'Default (01)', value: 'projects01' }]),
        section('beforeAfter', 'Before & After', [{ label: 'Default (01)', value: 'beforeAfter01' }]),
        section('testimonials', 'Testimonials', [{ label: 'Default (01)', value: 'testimonials01' }]),
        section('team', 'Team', [{ label: 'Default (01)', value: 'team01' }]),
        section('faq', 'FAQ', [{ label: 'Default (01)', value: 'faq01' }]),
        section('cta', 'Call to action', [{ label: 'Default (01)', value: 'cta01' }]),
        section('contact', 'Contact', [{ label: 'Default (01)', value: 'contact01' }]),
      ],
    },
  ],
}
