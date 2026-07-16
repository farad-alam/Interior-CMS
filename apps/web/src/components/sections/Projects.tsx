import React from 'react'
import Link from 'next/link'
import type { Project } from '@/payload-types'
import { mediaURL, mediaAlt } from '@/lib/media'

export function Projects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null
  return (
    <section className="section section--muted" id="projects">
      <div className="container">
        <header className="section__head">
          <p className="section__eyebrow">Portfolio</p>
          <h2 className="section__title">Featured Projects</h2>
        </header>
        <div className="grid grid--3">
          {projects.map((p) => {
            const cover = mediaURL(p.coverImage)
            return (
              <Link key={p.id} href={`/projects/${p.slug}`} className="card project-card">
                <div className="project-card__media">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={mediaAlt(p.coverImage, p.title)} />
                  ) : null}
                </div>
                <div className="project-card__body">
                  <h3 className="card__title">{p.title}</h3>
                  <p className="project-card__meta">
                    {[p.location, p.year].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
