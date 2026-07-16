// One-time sample-content seeder for local dev / demos.
// Run the dev server first, then: pnpm --filter web seed
// Generates placeholder images locally (offline) and posts content via the
// Payload REST API. Safe to read; creates duplicates if run more than once.
import sharp from 'sharp'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.SEED_EMAIL || 'admin@motionbite.dev'
const PASSWORD = process.env.SEED_PASSWORD || 'TempDevPass!2026x'

const authHeader = (token) => ({ Authorization: `JWT ${token}` })

async function getToken() {
  let res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (res.ok) return (await res.json()).token

  // No user yet — create the first one.
  res = await fetch(`${BASE}/api/users/first-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  if (!res.ok) throw new Error(`auth failed: ${res.status} ${await res.text()}`)
  return (await res.json()).token
}

async function makeImage(label, from, to) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="60" y="740" font-family="Georgia, serif" font-size="54"
          fill="rgba(255,255,255,0.9)">${label}</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}

async function uploadImage(token, { label, from, to, alt }) {
  const buffer = await makeImage(label, from, to)
  const form = new FormData()
  const filename = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`
  form.append('file', new Blob([buffer], { type: 'image/jpeg' }), filename)
  form.append('_payload', JSON.stringify({ alt: alt || label }))
  const res = await fetch(`${BASE}/api/media`, { method: 'POST', headers: authHeader(token), body: form })
  if (!res.ok) throw new Error(`upload ${label} failed: ${res.status} ${await res.text()}`)
  return (await res.json()).doc.id
}

async function create(token, collection, data) {
  const res = await fetch(`${BASE}/api/${collection}`, {
    method: 'POST',
    headers: { ...authHeader(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`create ${collection} failed: ${res.status} ${await res.text()}`)
  return (await res.json()).doc
}

async function updateGlobal(token, slug, data) {
  const res = await fetch(`${BASE}/api/globals/${slug}`, {
    method: 'POST',
    headers: { ...authHeader(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`global ${slug} failed: ${res.status} ${await res.text()}`)
  return (await res.json())
}

async function main() {
  console.log('→ authenticating')
  const token = await getToken()

  console.log('→ uploading images')
  const heroImg = await uploadImage(token, { label: 'Warm Living Space', from: '#3a3128', to: '#0f0d0b', alt: 'Elegant living room' })
  const p1 = await uploadImage(token, { label: 'Riyadh Villa', from: '#8a7a63', to: '#4a4034' })
  const p2 = await uploadImage(token, { label: 'Modern Kitchen', from: '#9aa39b', to: '#4d554e' })
  const p3 = await uploadImage(token, { label: 'Majlis Lounge', from: '#a58d6f', to: '#5c4a34' })
  const beforeImg = await uploadImage(token, { label: 'Before', from: '#8f8a80', to: '#5a564f' })
  const afterImg = await uploadImage(token, { label: 'After', from: '#c9a227', to: '#6b5417' })

  console.log('→ categories')
  const living = await create(token, 'categories', { title: 'Living Rooms', slug: 'living-rooms' })
  const kitchen = await create(token, 'categories', { title: 'Kitchens', slug: 'kitchens' })
  const majlis = await create(token, 'categories', { title: 'Majlis', slug: 'majlis' })

  console.log('→ services')
  await create(token, 'services', { title: 'Interior Design', description: 'Full-service design from concept to handover.', icon: '🛋️', order: 1 })
  await create(token, 'services', { title: 'Space Planning', description: 'Layouts that make every square meter work harder.', icon: '📐', order: 2 })
  await create(token, 'services', { title: 'Turnkey Fit-Out', description: 'We manage build, joinery, and finishing end to end.', icon: '🔑', order: 3 })
  await create(token, 'services', { title: 'Furniture & Styling', description: 'Curated furniture, lighting, and the final styling touches.', icon: '✨', order: 4 })

  console.log('→ projects')
  await create(token, 'projects', {
    title: 'Riyadh Villa Renovation', slug: 'riyadh-villa', category: living.id,
    description: 'A full renovation blending warm neutrals with contemporary lines. We reworked the flow between the majlis, living, and dining areas, introduced layered lighting throughout, and specified natural stone and timber finishes for a calm, timeless feel.',
    location: 'Riyadh', year: 2025, client: 'Private Residence',
    coverImage: p1, gallery: [p2, p3, beforeImg, afterImg],
    beforeImage: beforeImg, afterImage: afterImg,
    video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    featured: true, published: true,
  })
  await create(token, 'projects', {
    title: 'Minimalist Kitchen', slug: 'minimalist-kitchen', category: kitchen.id,
    description: 'Handleless cabinetry and stone surfaces for a calm, functional kitchen.',
    location: 'Jeddah', year: 2024, coverImage: p2, featured: true, published: true,
  })
  await create(token, 'projects', {
    title: 'Family Majlis', slug: 'family-majlis', category: majlis.id,
    description: 'A generous majlis designed for gatherings, with layered lighting.',
    location: 'Dammam', year: 2024, coverImage: p3, featured: true, published: true,
  })

  console.log('→ testimonials')
  await create(token, 'testimonials', { name: 'Sara Al-Otaibi', company: 'Homeowner, Riyadh', review: 'They understood exactly what we wanted and delivered beyond it. The villa feels brand new.', rating: 5 })
  await create(token, 'testimonials', { name: 'Khalid Rahman', company: 'Villa Owner, Jeddah', review: 'Professional from day one. The kitchen is now the heart of our home.', rating: 5 })
  await create(token, 'testimonials', { name: 'Noura Al-Farsi', company: 'Apartment, Dammam', review: 'Beautiful work and a smooth process. Highly recommend the team.', rating: 4 })

  console.log('→ faqs')
  await create(token, 'faqs', { question: 'How long does a typical project take?', answer: 'Most residential projects run 8–16 weeks depending on scope and finishes.', order: 1 })
  await create(token, 'faqs', { question: 'Do you handle the construction too?', answer: 'Yes — we offer turnkey fit-out, managing build, joinery, and finishing end to end.', order: 2 })
  await create(token, 'faqs', { question: 'Can you work with my budget?', answer: 'We tailor materials and scope to your budget and are transparent about trade-offs.', order: 3 })
  await create(token, 'faqs', { question: 'Do you work outside Riyadh?', answer: 'Absolutely — we deliver projects across the Kingdom.', order: 4 })

  console.log('→ team')
  await create(token, 'team', { name: 'Layla Al-Ghamdi', role: 'Founder & Lead Designer', bio: 'Fifteen years shaping homes across the Kingdom, with an eye for warm, liveable luxury.', order: 1 })
  await create(token, 'team', { name: 'Omar Nasser', role: 'Project Director', bio: 'Keeps every fit-out on time and on budget, from first survey to final styling.', order: 2 })
  await create(token, 'team', { name: 'Hana Farouk', role: 'Interior Architect', bio: 'Turns tricky layouts into effortless, light-filled spaces.', order: 3 })

  console.log('→ site settings')
  await updateGlobal(token, 'site-settings', {
    siteName: 'Atelier Noor',
    primaryColor: '#C9A227',
    whatsappNumber: '966500000000',
    hero: {
      headline: 'Interiors that feel like home',
      subheadline: 'Bespoke interior design and turnkey fit-out for homes across Saudi Arabia.',
      image: heroImg,
      ctaLabel: 'Get a free consultation',
    },
    about: {
      heading: 'Design rooted in how you live',
      body: 'Atelier Noor is a Riyadh-based interior design studio creating warm, considered homes across the Kingdom.\nWe believe great interiors start with listening — to how a family gathers, how light moves through a room, and how a space should feel at the end of a long day.\nFrom first sketch to final styling, we handle design and fit-out under one roof, so the result matches the vision exactly.',
      image: heroImg,
    },
    social: { instagram: 'https://instagram.com', facebook: 'https://facebook.com' },
  })

  console.log('✓ seed complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
