import type { CollectionBeforeValidateHook } from 'payload'

const slugify = (value: string): string =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Auto-fills an empty `slug` from a source field (default: title) before
 * validation, so clients never have to hand-type slugs. If they DID enter
 * one, it's left untouched. Runs before validation so the generated value
 * satisfies the `required` rule.
 */
export const generateSlug =
  (source = 'title'): CollectionBeforeValidateHook =>
  ({ data }) => {
    if (data && !data.slug && typeof data[source] === 'string') {
      const generated = slugify(data[source])
      if (generated) data.slug = generated
    }
    return data
  }
