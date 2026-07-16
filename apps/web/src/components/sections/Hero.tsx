import React from 'react'
import type { SiteSetting } from '@/payload-types'
import { mediaURL } from '@/lib/media'
import { WhatsAppButton } from '../WhatsAppButton'

export function Hero({ settings }: { settings: SiteSetting }) {
  const hero = settings.hero
  const bg = mediaURL(hero?.image)
  const headline = hero?.headline || settings.siteName
  const sub = hero?.subheadline

  return (
    <section className="hero" id="top" style={bg ? { backgroundImage: `url(${bg})` } : undefined}>
      <div className="hero__overlay" />
      <div className="container hero__inner">
        <h1 className="hero__title">{headline}</h1>
        {sub ? <p className="hero__subtitle">{sub}</p> : null}
        <div className="hero__actions">
          <a href="#projects" className="btn btn--brand">
            View our work
          </a>
          <WhatsAppButton
            number={settings.whatsappNumber}
            label={hero?.ctaLabel || 'Get a free consultation'}
            className="btn btn--ghost"
          />
        </div>
      </div>
    </section>
  )
}
