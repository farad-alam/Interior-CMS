import type { Media } from '@/payload-types'

/** An upload field is either a numeric id (unpopulated) or a Media object. */
type MediaRef = number | Media | null | undefined

export const mediaURL = (m: MediaRef): string =>
  typeof m === 'object' && m ? (m.url ?? '') : ''

export const mediaAlt = (m: MediaRef, fallback = ''): string =>
  typeof m === 'object' && m ? (m.alt ?? fallback) : fallback

// The Cloudinary storage adapter injects `cloudinaryURL` onto media docs, but
// only when the plugin is active (prod), so it's absent from the locally
// generated Media type — read it through a cast.
const cloudinaryURLOf = (m: MediaRef): string | undefined =>
  typeof m === 'object' && m ? (m as Media & { cloudinaryURL?: string }).cloudinaryURL : undefined

/** Insert a Cloudinary transformation into an /upload/ URL. */
const transform = (cloudinaryURL: string, t: string) =>
  cloudinaryURL.replace('/upload/', `/upload/${t}/`)

type ImageOpts = { widths?: number[]; sizes?: string }

/**
 * Responsive image attributes. In production (media on Cloudinary) this returns
 * a `srcSet` of resized, auto-format (webp/avif), auto-quality variants so the
 * browser downloads an appropriately sized image — a big Core Web Vitals win on
 * an image-heavy interior-design site (plan Phase 11). Locally (media on disk)
 * there's no Cloudinary URL, so it falls back to the plain proxy `src`.
 */
export function responsiveImage(m: MediaRef, opts: ImageOpts = {}) {
  const src = mediaURL(m)
  const cloudinaryURL = cloudinaryURLOf(m)
  if (!cloudinaryURL || !cloudinaryURL.includes('/upload/')) {
    return { src }
  }
  const widths = opts.widths ?? [480, 768, 1200, 1600]
  const build = (w: number) => transform(cloudinaryURL, `w_${w},c_limit,f_auto,q_auto`)
  return {
    src: build(widths[widths.length - 1]),
    srcSet: widths.map((w) => `${build(w)} ${w}w`).join(', '),
    sizes: opts.sizes,
  }
}

/** A single Cloudinary-optimized URL for CSS backgrounds (no srcSet possible). */
export function backgroundURL(m: MediaRef, width = 1920): string {
  const cloudinaryURL = cloudinaryURLOf(m)
  if (cloudinaryURL && cloudinaryURL.includes('/upload/')) {
    return transform(cloudinaryURL, `w_${width},c_limit,f_auto,q_auto`)
  }
  return mediaURL(m)
}
