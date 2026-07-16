import { getPayloadClient } from './payload'
import type { SiteLocale } from './getHomeData'

/** Site-wide settings (branding, WhatsApp, SEO defaults) for the shared layout. */
export async function getSettings(locale: SiteLocale = 'en') {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
}
