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
import { Homepage } from './globals/Homepage'
import { cloudinaryAdapter } from './lib/cloudinaryAdapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const hasCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME)

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
  globals: [SiteSettings, Homepage],
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
  // Postgres (Neon) is used for BOTH local dev and production — one shared
  // database, so local and the live site always show the same content.
  // `push: false` disables dev-mode schema auto-sync so migrations are the
  // single source of truth; this prevents a local field change from silently
  // altering the live schema. Schema changes => `payload migrate:create` then
  // `payload migrate` (the build applies them automatically on deploy).
  // SQLite remains a zero-setup fallback only if DATABASE_URL is ever unset.
  db: process.env.DATABASE_URL
    ? postgresAdapter({ push: false, pool: { connectionString: process.env.DATABASE_URL } })
    : sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./payload.db' } }),
  sharp,
  plugins: [
    // Cloudinary media (plan Phase 0.4/11). `enabled` toggles the actual
    // upload behaviour on the presence of keys (falls back to local disk when
    // absent), but `alwaysInsertFields` keeps the cloudinary columns in the
    // schema either way — so the DB schema and migrations are identical across
    // every environment and can't drift on whether the keys happen to be set.
    cloudStoragePlugin({
      enabled: hasCloudinary,
      alwaysInsertFields: true,
      collections: {
        media: {
          adapter: cloudinaryAdapter(),
          disableLocalStorage: hasCloudinary,
        },
      },
    }),
  ],
})
