import React from 'react'
import './styles.css'
import { getSettings } from '@/lib/getSettings'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata() {
  const settings = await getSettings('en')
  const title = settings.seo?.title || settings.siteName
  const description = settings.seo?.description || undefined
  return {
    metadataBase: new URL(base),
    title: {
      default: title,
      template: `%s · ${settings.siteName}`,
    },
    description,
    openGraph: {
      type: 'website',
      siteName: settings.siteName,
      title,
      description,
    },
    twitter: { card: 'summary_large_image' },
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
