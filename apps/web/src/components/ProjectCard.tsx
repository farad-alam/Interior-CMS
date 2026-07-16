import React from 'react'
import Link from 'next/link'
import type { Project } from '@/payload-types'
import { responsiveImage, mediaAlt } from '@/lib/media'

export function ProjectCard({ project }: { project: Project }) {
  const cover = responsiveImage(project.coverImage, {
    widths: [400, 600, 900],
    sizes: '(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw',
  })
  return (
    <Link href={`/projects/${project.slug}`} className="card project-card">
      <div className="project-card__media">
        {cover.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.src}
            srcSet={cover.srcSet}
            sizes={cover.sizes}
            alt={mediaAlt(project.coverImage, project.title)}
          />
        ) : null}
      </div>
      <div className="project-card__body">
        <h3 className="card__title">{project.title}</h3>
        <p className="project-card__meta">
          {[project.location, project.year].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  )
}
