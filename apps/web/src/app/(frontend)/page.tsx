import React from 'react'
import { getHomeData } from '@/lib/getHomeData'
import { mediaURL, mediaAlt } from '@/lib/media'
// Hero variants: `Hero` (full-bleed) is active. To use the split layout,
// swap this import to `Hero02` and the <Hero .../> tag below to <Hero02 .../>.
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { Testimonials } from '@/components/sections/Testimonials'
import { Team } from '@/components/sections/Team'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'

// ISR: serve a cached static render, refreshed at most once a minute, so the
// site is fast/cheap on Vercel while still picking up CMS edits (plan Phase 6).
export const revalidate = 60

export default async function HomePage() {
  const { settings, services, projects, testimonials, team, faqs } = await getHomeData('en')

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
      <Team team={team} />
      <Faq faqs={faqs} />
      <Contact settings={settings} />
    </main>
  )
}
