import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const projects = await payload.find({
    collection: 'projects',
    where: { published: { equals: true } },
    limit: 1000,
    depth: 0,
  })

  const projectRoutes: MetadataRoute.Sitemap = projects.docs.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...projectRoutes,
  ]
}
