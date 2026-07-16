import React from 'react'
import type { SiteSetting } from '@/payload-types'
import { mediaURL, mediaAlt } from '@/lib/media'
import { WhatsAppButton } from '../WhatsAppButton'
import { NAV_ITEMS } from './navItems'
import { MobileNav } from './MobileNav'

export function Header({ settings }: { settings: SiteSetting }) {
  const logo = mediaURL(settings.logo)
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="/" className="site-header__brand">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={mediaAlt(settings.logo, settings.siteName)} width={40} height={40} />
          ) : null}
          <span>{settings.siteName}</span>
        </a>

        <div className="site-header__desktop">
          <nav className="site-nav">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <WhatsAppButton
            number={settings.whatsappNumber}
            label="Chat with us"
            className="btn btn--brand"
          />
        </div>

        <MobileNav whatsappNumber={settings.whatsappNumber} />
      </div>
    </header>
  )
}
