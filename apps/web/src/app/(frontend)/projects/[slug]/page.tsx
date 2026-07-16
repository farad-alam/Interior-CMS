import React from 'react'
import { notFound } from 'next/navigation'
import type { Media } from '@/payload-types'
import { getProject } from '@/lib/getProject'
import { mediaURL, mediaAlt } from '@/lib/media'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { VideoEmbed } from '@/components/VideoEmbed'

// ISR: cache each project page, refresh at most once a minute (plan Phase 6).
// Unknown slugs are rendered on-demand then cached; missing ones 404.
export const revalidate = 60

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project not found' }
  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.description || undefined,
  }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const cover = mediaURL(project.coverImage)
  const category = typeof project.category === 'object' && project.category ? project.category.title : null
  const gallery = ((project.gallery as (number | Media)[] | undefined) || [])
    .map((m) => ({ url: mediaURL(m), alt: mediaAlt(m, project.title) }))
    .filter((m) => m.url)
  const before = mediaURL(project.beforeImage)
  const after = mediaURL(project.afterImage)
  const meta = [category, project.location, project.year].filter(Boolean).join(' · ')

  return (
    <main className="project">
      <div className="project__hero" style={cover ? { backgroundImage: `url(${cover})` } : undefined}>
        <div className="project__hero-overlay" />
        <div className="container project__hero-inner">
          <a href="/#projects" className="project__back">
            ← Back to projects
          </a>
          <h1 className="project__title">{project.title}</h1>
          {meta ? <p className="project__meta">{meta}</p> : null}
        </div>
      </div>

      <div className="section">
        <div className="container container--narrow">
          {project.description ? <p className="project__desc">{project.description}</p> : null}
          <dl className="project__facts">
            {project.client ? (
              <div>
                <dt>Client</dt>
                <dd>{project.client}</dd>
              </div>
            ) : null}
            {project.location ? (
              <div>
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
            ) : null}
            {project.year ? (
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
            ) : null}
            {category ? (
              <div>
                <dt>Category</dt>
                <dd>{category}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>

      {before && after ? (
        <BeforeAfter
          before={before}
          after={after}
          beforeAlt={mediaAlt(project.beforeImage, `${project.title} before`)}
          afterAlt={mediaAlt(project.afterImage, `${project.title} after`)}
        />
      ) : null}

      {gallery.length > 0 ? (
        <section className="section section--muted">
          <div className="container">
            <div className="gallery">
              {gallery.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} className="gallery__item" src={img.url} alt={img.alt} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {project.video ? (
        <section className="section">
          <div className="container container--narrow">
            <h2 className="section__title" style={{ marginBottom: 24 }}>
              Walkthrough
            </h2>
            <VideoEmbed url={project.video} />
          </div>
        </section>
      ) : null}
    </main>
  )
}
