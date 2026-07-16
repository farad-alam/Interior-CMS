import React from 'react'
import './styles.css'
import { getSettings } from '@/lib/getSettings'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export async function generateMetadata() {
  const settings = await getSettings('en')
  return {
    title: {
      default: settings.seo?.title || settings.siteName,
      template: `%s · ${settings.siteName}`,
    },
    description: settings.seo?.description || undefined,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings('en')

  return (
    <html lang="en">
      <body>
        <div style={{ ['--brand' as string]: settings.primaryColor || '#111111' }}>
          <Header settings={settings} />
          {children}
          <Footer settings={settings} />
        </div>
      </body>
    </html>
  )
}
