import React from 'react'

type Props = {
  number?: string | null
  label?: string
  className?: string
}

/** wa.me deep link — the dominant inquiry channel for the target market. */
export function WhatsAppButton({ number, label = 'WhatsApp', className }: Props) {
  if (!number) return null
  const digits = number.replace(/[^0-9]/g, '')
  return (
    <a
      className={className}
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  )
}
