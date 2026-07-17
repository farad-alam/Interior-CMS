import React from 'react'
import { getHomeData } from '@/lib/getHomeData'
import { mediaURL, mediaAlt } from '@/lib/media'
import { Hero } from '@/components/sections/Hero'
import { Hero02 } from '@/components/sections/Hero02'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'
import { BeforeAfter } from '@/components/sections/BeforeAfter'
import { Testimonials } from '@/components/sections/Testimonials'
import { Team } from '@/components/sections/Team'
import { Faq } from '@/components/sections/Faq'
import { CTA } from '@/components/sections/CTA'
import { Contact } from '@/components/sections/Contact'

// ISR: serve a cached static render, refreshed at most once a minute, so the
// site is fast/cheap on Vercel while still picking up CMS edits (plan Phase 6).
// Site Settings / Home Page Builder edits also revalidate instantly via hook.
export const revalidate = 60

// A block from the Home Page Builder — only its type + variant matter here;
// content comes from the collections/globals fetched below.
type Block = { blockType?: string; variant?: string | null; id?: string | null }

// Used when the builder hasn't been configured yet, so the page is never blank.
const DEFAULT_LAYOUT: Block[] = [
  { blockType: 'hero', variant: 'hero01' },
  { blockType: 'services' },
  { blockType: 'projects' },
  { blockType: 'beforeAfter' },
  { blockType: 'testimonials' },
  { blockType: 'team' },
  { blockType: 'faq' },
  { blockType: 'contact' },
]

export default async function HomePage() {
  const { settings, homepage, services, projects, testimonials, team, faqs } =
    await getHomeData('en')

  const baProject = projects.find((p) => mediaURL(p.beforeImage) && mediaURL(p.afterImage))

  const configured = (homepage?.sections as Block[] | undefined) ?? []
  const layout = configured.length > 0 ? configured : DEFAULT_LAYOUT

  const renderBlock = (block: Block, i: number) => {
    const key = block.id ?? i
    switch (block.blockType) {
      case 'hero':
        return block.variant === 'hero02' ? (
          <Hero02 key={key} settings={settings} />
        ) : (
          <Hero key={key} settings={settings} />
        )
      case 'services':
        return <Services key={key} services={services} />
      case 'projects':
        return <Projects key={key} projects={projects} />
      case 'beforeAfter':
        return baProject ? (
          <BeforeAfter
            key={key}
            before={mediaURL(baProject.beforeImage)}
            after={mediaURL(baProject.afterImage)}
            beforeAlt={mediaAlt(baProject.beforeImage, `${baProject.title} before`)}
            afterAlt={mediaAlt(baProject.afterImage, `${baProject.title} after`)}
            title={baProject.title}
          />
        ) : null
      case 'testimonials':
        return <Testimonials key={key} testimonials={testimonials} />
      case 'team':
        return <Team key={key} team={team} />
      case 'faq':
        return <Faq key={key} faqs={faqs} />
      case 'cta':
        return <CTA key={key} settings={settings} />
      case 'contact':
        return <Contact key={key} settings={settings} />
      default:
        return null
    }
  }

  return <main>{layout.map(renderBlock)}</main>
}
