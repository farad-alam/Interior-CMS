import { getPayloadClient } from './payload'
import type { SiteLocale } from './getHomeData'

/** A single published project by slug. depth:2 populates category + media. */
export async function getProject(slug: string, locale: SiteLocale = 'en') {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'projects',
    locale,
    where: {
      and: [{ slug: { equals: slug } }, { published: { equals: true } }],
    },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
}
