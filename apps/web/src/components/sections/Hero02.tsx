import React from 'react'
import type { SiteSetting } from '@/payload-types'
import { responsiveImage, mediaAlt } from '@/lib/media'
import { WhatsAppButton } from '../WhatsAppButton'

/**
 * Hero variant 02 — a light, two-column "split" layout: headline + actions on
 * one side, a framed image on the other. Accepts the exact same `{ settings }`
 * prop as the default Hero, so the two are drop-in interchangeable (plan
 * Phase 7 — every variant shares one data shape).
 */
export function Hero02({ settings }: { settings: SiteSetting }) {
  const hero = settings.hero
  const img = responsiveImage(hero?.image, {
    widths: [600, 900, 1200],
    sizes: '(max-width: 900px) 100vw, 50vw',
  })
  const headline = hero?.headline || settings.siteName
  const sub = hero?.subheadline

  return (
    <section className="hero2" id="top">
      <div className="container hero2__inner">
        <div className="hero2__content">
          <p className="hero2__eyebrow">{settings.siteName}</p>
          <h1 className="hero2__title">{headline}</h1>
          {sub ? <p className="hero2__subtitle">{sub}</p> : null}
          <div className="hero2__actions">
            <a href="#projects" className="btn btn--brand">
              View our work
            </a>
            <WhatsAppButton
              number={settings.whatsappNumber}
              label={hero?.ctaLabel || 'Get a free consultation'}
              className="btn btn--outline"
            />
          </div>
        </div>

        {img.src ? (
          <div className="hero2__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} srcSet={img.srcSet} sizes={img.sizes} alt={mediaAlt(hero?.image, headline)} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
