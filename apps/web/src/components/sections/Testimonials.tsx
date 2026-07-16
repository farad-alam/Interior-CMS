import React from 'react'
import type { Testimonial } from '@/payload-types'
import { mediaURL, mediaAlt } from '@/lib/media'

function Stars({ rating }: { rating?: number | null }) {
  const n = Math.max(0, Math.min(5, rating ?? 5))
  return (
    <div className="stars" aria-label={`${n} out of 5`}>
      {'★'.repeat(n)}
      <span className="stars__empty">{'★'.repeat(5 - n)}</span>
    </div>
  )
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null
  return (
    <section className="section section--muted" id="testimonials">
      <div className="container">
        <header className="section__head">
          <p className="section__eyebrow">Kind words</p>
          <h2 className="section__title">What Clients Say</h2>
        </header>
        <div className="grid grid--3">
          {testimonials.map((t) => {
            const photo = mediaURL(t.photo)
            return (
              <blockquote key={t.id} className="card testimonial">
                <Stars rating={t.rating} />
                <p className="testimonial__text">“{t.review}”</p>
                <footer className="testimonial__author">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="testimonial__avatar"
                      src={photo}
                      alt={mediaAlt(t.photo, t.name)}
                      width={44}
                      height={44}
                      loading="lazy"
                    />
                  ) : null}
                  <span>
                    <strong>{t.name}</strong>
                    {t.company ? <em>{t.company}</em> : null}
                  </span>
                </footer>
              </blockquote>
            )
          })}
        </div>
      </div>
    </section>
  )
}
