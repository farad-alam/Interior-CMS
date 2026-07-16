'use client'

import React, { useState } from 'react'

type Props = {
  before: string
  after: string
  beforeAlt: string
  afterAlt: string
  title?: string
}

/**
 * Interactive before/after reveal. The "before" image sits on top, full-size,
 * and is clipped from the right by the slider position — so both images stay
 * in identical framing at any slider value.
 */
export function BeforeAfter({ before, after, beforeAlt, afterAlt, title }: Props) {
  const [pos, setPos] = useState(50)

  return (
    <section className="section" id="before-after">
      <div className="container">
        <header className="section__head">
          <p className="section__eyebrow">The transformation</p>
          <h2 className="section__title">Before &amp; After</h2>
        </header>

        <figure className="ba">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ba__img" src={after} alt={afterAlt} />
          <div className="ba__before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ba__img" src={before} alt={beforeAlt} />
          </div>

          <div className="ba__divider" style={{ left: `${pos}%` }} aria-hidden="true">
            <span className="ba__handle" />
          </div>

          <input
            className="ba__range"
            type="range"
            min={0}
            max={100}
            value={pos}
            aria-label="Reveal before and after"
            onChange={(e) => setPos(Number(e.target.value))}
          />

          <span className="ba__tag ba__tag--before">Before</span>
          <span className="ba__tag ba__tag--after">After</span>
        </figure>
        {title ? <p className="ba__caption">{title}</p> : null}
      </div>
    </section>
  )
}
