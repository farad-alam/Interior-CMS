import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Services } from './collections/Services'
import { Projects } from './collections/Projects'
import { Testimonials } from './collections/Testimonials'
import { Team } from './collections/Team'
import { Faqs } from './collections/Faqs'
import { Posts } from './collections/Posts'
import { Leads } from './collections/Leads'
import { SiteSettings } from './globals/SiteSettings'
import { cloudinaryAdapter } from './lib/cloudinaryAdapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Services,
    Projects,
    Testimonials,
    Team,
    Faqs,
    Posts,
    Leads,
  ],
  globals: [SiteSettings],
  // Bilingual by default — the target market is Saudi Arabia (plan Phase 10).
  // Any field marked `localized: true` gets a separate EN and AR value.
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'العربية', code: 'ar', rtl: true },
    ],
    defaultLocale: 'en',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Zero-setup SQLite for local dev when DATABASE_URL isn't set; a real
  // client deployment sets DATABASE_URL to its free Neon project (plan
  // Phase 0.4), which switches this to Postgres automatically.
  db: process.env.DATABASE_URL
    ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } })
    : sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./payload.db' } }),
  sharp,
  plugins: [
    // Cloudinary handles media only when its keys are present (i.e. in
    // production / when you've set CLOUDINARY_* — plan Phase 0.4/11).
    // Without them, local dev falls back to Payload's built-in disk storage
    // so the app runs fully offline with no external dependency.
    ...(process.env.CLOUDINARY_CLOUD_NAME
      ? [
          cloudStoragePlugin({
            collections: {
              media: {
                adapter: cloudinaryAdapter(),
                disableLocalStorage: true,
              },
            },
          }),
        ]
      : []),
  ],
})
