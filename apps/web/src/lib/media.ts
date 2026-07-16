import type { Media } from '@/payload-types'

/** An upload field is either a numeric id (unpopulated) or a Media object. */
type MediaRef = number | Media | null | undefined

export const mediaURL = (m: MediaRef): string =>
  typeof m === 'object' && m ? (m.url ?? '') : ''

export const mediaAlt = (m: MediaRef, fallback = ''): string =>
  typeof m === 'object' && m ? (m.alt ?? fallback) : fallback
