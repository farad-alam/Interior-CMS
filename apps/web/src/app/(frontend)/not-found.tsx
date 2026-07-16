import React from 'react'

export default function NotFound() {
  return (
    <main className="section">
      <div className="container container--narrow" style={{ textAlign: 'center' }}>
        <p className="section__eyebrow">404</p>
        <h1 className="section__title">Page not found</h1>
        <p style={{ color: 'var(--muted)', margin: '16px 0 28px' }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <a href="/" className="btn btn--brand">
          Back to home
        </a>
      </div>
    </main>
  )
}
