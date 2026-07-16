import React from 'react'
import type { SiteSetting } from '@/payload-types'

export function Footer({ settings }: { settings: SiteSetting }) {
  const social = settings.social
  const links = [
    { href: social?.instagram, label: 'Instagram' },
    { href: social?.facebook, label: 'Facebook' },
    { href: social?.x, label: 'X' },
  ].filter((l) => l.href)

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__brand">{settings.siteName}</p>
          {settings.whatsappNumber ? (
            <p className="site-footer__meta">WhatsApp: {settings.whatsappNumber}</p>
          ) : null}
        </div>
        {links.length > 0 ? (
          <nav className="site-footer__social">
            {links.map((l) => (
              <a key={l.label} href={l.href as string} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </nav>
        ) : null}
        <p className="site-footer__copy">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
