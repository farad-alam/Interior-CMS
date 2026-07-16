import { z } from 'zod'

/** A resolved media reference the frontend can render directly. */
export const MediaSchema = z.object({
  url: z.string(),
  alt: z.string(),
})
export type Media = z.infer<typeof MediaSchema>

/**
 * The canonical Project shape. Every Portfolio component variant is written
 * against this — which is what makes the variants swappable (plan Phase 2 &
 * Phase 7). It intentionally mirrors the `projects` collection in the CMS.
 */
export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  location: z.string().optional(),
  year: z.number().optional(),
  client: z.string().optional(),
  coverImage: MediaSchema,
  gallery: z.array(MediaSchema),
  beforeImage: MediaSchema.optional(),
  afterImage: MediaSchema.optional(),
  video: z.string().url().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seo: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
})

export type Project = z.infer<typeof ProjectSchema>
