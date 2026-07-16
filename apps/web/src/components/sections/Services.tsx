import React from 'react'
import type { Service } from '@/payload-types'

export function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null
  return (
    <section className="section" id="services">
      <div className="container">
        <header className="section__head">
          <p className="section__eyebrow">What we do</p>
          <h2 className="section__title">Our Services</h2>
        </header>
        <div className="grid grid--3">
          {services.map((s) => (
            <article key={s.id} className="card service-card">
              {s.icon ? <div className="service-card__icon">{s.icon}</div> : null}
              <h3 className="card__title">{s.title}</h3>
              {s.description ? <p className="card__text">{s.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
