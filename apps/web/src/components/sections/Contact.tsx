'use client'

import React, { useState } from 'react'
import type { SiteSetting } from '@/payload-types'
import { WhatsAppButton } from '../WhatsAppButton'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY = { name: '', email: '', phone: '', message: '' }

export function Contact({ settings }: { settings: SiteSetting }) {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState(EMPTY)

  const update =
    (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, channel: 'form' }),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('success')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__intro">
          <p className="section__eyebrow">Get in touch</p>
          <h2 className="section__title">Let’s talk about your space</h2>
          <p className="contact__lead">
            Tell us a little about your project and we’ll get back to you within one business day.
          </p>
          <WhatsAppButton
            number={settings.whatsappNumber}
            label="Prefer WhatsApp? Chat now"
            className="btn btn--brand"
          />
        </div>

        <form className="contact__form card" onSubmit={onSubmit}>
          {status === 'success' ? (
            <div className="contact__success" role="status">
              <p className="contact__success-title">Thank you!</p>
              <p>We’ve received your message and will be in touch shortly.</p>
            </div>
          ) : (
            <>
              <label className="field">
                <span>Name</span>
                <input required value={form.name} onChange={update('name')} autoComplete="name" />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    autoComplete="email"
                  />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input value={form.phone} onChange={update('phone')} autoComplete="tel" />
                </label>
              </div>
              <label className="field">
                <span>Message</span>
                <textarea rows={4} value={form.message} onChange={update('message')} />
              </label>
              <button type="submit" className="btn btn--brand" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Send message'}
              </button>
              {status === 'error' ? (
                <p className="contact__error" role="alert">
                  Something went wrong. Please try again or reach us on WhatsApp.
                </p>
              ) : null}
            </>
          )}
        </form>
      </div>
    </section>
  )
}
