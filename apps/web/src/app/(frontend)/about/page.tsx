import React from 'react'
import { getSettings } from '@/lib/getSettings'
import { getPayloadClient } from '@/lib/payload'
import { Team } from '@/components/sections/Team'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { mediaURL, mediaAlt } from '@/lib/media'

export const revalidate = 60

export const metadata = { title: 'About' }

export default async function AboutPage() {
  const settings = await getSettings('en')
  const payload = await getPayloadClient()
  const team = await payload.find({ collection: 'team', sort: 'order', limit: 24, depth: 1 })

  const about = settings.about
  const heading = about?.heading || `About ${settings.siteName}`
  const body = about?.body
  const image = mediaURL(about?.image)

  return (
    <main>
      <section className="section">
        <div className="container">
          <header className="section__head">
            <p className="section__eyebrow">Who we are</p>
            <h1 className="section__title">{heading}</h1>
          </header>

          {body || image ? (
            <div className={`about__grid${image ? '' : ' about__grid--text-only'}`}>
              {body ? (
                <div className="about__body">
                  {body.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : null}
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="about__image" src={image} alt={mediaAlt(about?.image, heading)} />
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <div className="section--muted">
        <Team team={team.docs} />
      </div>

      <section className="cta">
        <div className="container cta__inner">
          <h2 className="cta__title">Let’s create something beautiful</h2>
          <p className="cta__text">Tell us about your space and we’ll take it from there.</p>
          <WhatsAppButton
            number={settings.whatsappNumber}
            label="Start your project"
            className="btn btn--light"
          />
        </div>
      </section>
    </main>
  )
}
