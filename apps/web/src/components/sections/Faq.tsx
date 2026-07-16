'use client'

import React, { useState } from 'react'
import type { Faq as FaqType } from '@/payload-types'

export function Faq({ faqs }: { faqs: FaqType[] }) {
  const [open, setOpen] = useState<string | number | null>(faqs[0]?.id ?? null)
  if (faqs.length === 0) return null

  return (
    <section className="section" id="faq">
      <div className="container container--narrow">
        <header className="section__head">
          <p className="section__eyebrow">Good to know</p>
          <h2 className="section__title">Frequently Asked Questions</h2>
        </header>
        <div className="accordion">
          {faqs.map((f) => {
            const isOpen = open === f.id
            return (
              <div key={f.id} className={`accordion__item${isOpen ? ' is-open' : ''}`}>
                <button
                  className="accordion__trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : f.id)}
                >
                  <span>{f.question}</span>
                  <span className="accordion__icon" aria-hidden="true">
                    {isOpen ? '–' : '+'}
                  </span>
                </button>
                {isOpen ? <div className="accordion__panel">{f.answer}</div> : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
