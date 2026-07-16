'use client'

import React, { useState } from 'react'
import { NAV_ITEMS } from './navItems'
import { WhatsAppButton } from '../WhatsAppButton'

export function MobileNav({ whatsappNumber }: { whatsappNumber?: string | null }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mobile-nav">
      <button
        className={`mobile-nav__toggle${open ? ' is-open' : ''}`}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {open ? (
        <>
          <div className="mobile-nav__backdrop" onClick={() => setOpen(false)} />
          <nav className="mobile-nav__panel">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <WhatsAppButton number={whatsappNumber} label="Chat with us" className="btn btn--brand" />
          </nav>
        </>
      ) : null}
    </div>
  )
}
