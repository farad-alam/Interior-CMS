import React from 'react'
import { getHomeData } from '@/lib/getHomeData'
import { mediaURL, mediaAlt } from '@/lib/media'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { Testimonials } from '@/components/sections/Testimonials'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'

// ISR: serve a cached static render, refreshed at most once a minute, so the
// site is fast/cheap on Vercel while still picking up CMS edits (plan Phase 6).
export const revalidate = 60

export default async function HomePage() {
  const { settings, services, projects, testimonials, faqs } = await getHomeData('en')

  // First published project with both a before and after image drives the
  // Before/After section. If none exists, the section is skipped.
  const baProject = projects.find((p) => mediaURL(p.beforeImage) && mediaURL(p.afterImage))

  return (
    <main>
      <Hero settings={settings} />
      <Services services={services} />
      <Projects projects={projects} />
      {baProject ? (
        <BeforeAfter
          before={mediaURL(baProject.beforeImage)}
          after={mediaURL(baProject.afterImage)}
          beforeAlt={mediaAlt(baProject.beforeImage, `${baProject.title} before`)}
          afterAlt={mediaAlt(baProject.afterImage, `${baProject.title} after`)}
          title={baProject.title}
        />
      ) : null}
      <Testimonials testimonials={testimonials} />
      <Faq faqs={faqs} />
      <Contact settings={settings} />
    </main>
  )
}
