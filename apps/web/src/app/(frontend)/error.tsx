'use client'

import React, { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In production this is where you'd report to an error service.
    console.error(error)
  }, [error])

  return (
    <main className="section">
      <div className="container container--narrow" style={{ textAlign: 'center' }}>
        <p className="section__eyebrow">Something went wrong</p>
        <h1 className="section__title">We hit a snag</h1>
        <p style={{ color: 'var(--muted)', margin: '16px 0 28px' }}>
          Sorry — this page failed to load. Please try again.
        </p>
        <button className="btn btn--brand" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  )
}
