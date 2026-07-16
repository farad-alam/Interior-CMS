import React from 'react'
import type { SiteSetting } from '@/payload-types'
import { WhatsAppButton } from '../WhatsAppButton'

export function CTA({ settings }: { settings: SiteSetting }) {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <h2 className="cta__title">Ready to transform your space?</h2>
        <p className="cta__text">
          Tell us about your project and we’ll get back to you within one business day.
        </p>
        <WhatsAppButton
          number={settings.whatsappNumber}
          label={settings.hero?.ctaLabel || 'Start your project'}
          className="btn btn--light"
        />
      </div>
    </section>
  )
}
