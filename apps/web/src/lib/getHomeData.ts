import { getPayloadClient } from './payload'

export type SiteLocale = 'en' | 'ar'

/**
 * Everything the homepage needs, in one locale-aware call. `depth: 1`
 * populates upload relationships (media) so components get `.url` directly.
 */
export async function getHomeData(locale: SiteLocale = 'en') {
  const payload = await getPayloadClient()

  const [settings, services, projects, testimonials, faqs] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }),
    payload.find({ collection: 'services', locale, sort: 'order', limit: 100, depth: 1 }),
    payload.find({
      collection: 'projects',
      locale,
      where: { published: { equals: true } },
      sort: '-featured',
      limit: 6,
      depth: 1,
    }),
    payload.find({ collection: 'testimonials', locale, limit: 12, depth: 1 }),
    payload.find({ collection: 'faqs', locale, sort: 'order', limit: 20, depth: 1 }),
  ])

  return {
    settings,
    services: services.docs,
    projects: projects.docs,
    testimonials: testimonials.docs,
    faqs: faqs.docs,
  }
}

export type HomeData = Awaited<ReturnType<typeof getHomeData>>
