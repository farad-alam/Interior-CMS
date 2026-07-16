import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { ProjectCard } from '@/components/ProjectCard'

export const revalidate = 60

export const metadata = { title: 'Projects' }

export default async function ProjectsIndexPage() {
  const payload = await getPayloadClient()
  const projects = await payload.find({
    collection: 'projects',
    where: { published: { equals: true } },
    sort: '-featured',
    limit: 100,
    depth: 1,
  })

  return (
    <main className="section">
      <div className="container">
        <header className="section__head">
          <p className="section__eyebrow">Portfolio</p>
          <h1 className="section__title">Our Projects</h1>
        </header>
        {projects.docs.length > 0 ? (
          <div className="grid grid--3">
            {projects.docs.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--muted)' }}>No projects published yet.</p>
        )}
      </div>
    </main>
  )
}
