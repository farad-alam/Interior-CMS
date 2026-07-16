import React from 'react'
import type { Project } from '@/payload-types'
import { ProjectCard } from '../ProjectCard'

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
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
