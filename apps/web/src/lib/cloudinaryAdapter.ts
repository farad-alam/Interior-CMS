import { v2 as cloudinary } from 'cloudinary'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

/**
 * Payload has no official Cloudinary adapter, so this implements the
 * documented `GeneratedAdapter` shape directly against Cloudinary's SDK
 * (plan Phase 0.4/11 — Cloudinary is the free-tier media layer). Two extra
 * hidden fields (cloudinaryURL, cloudinaryPublicId) get injected into
 * whichever collection uses this adapter so generateURL/handleDelete have
 * something to read without re-querying Cloudinary.
 */
export const cloudinaryAdapter = (): Adapter => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })

  return () => ({
    name: 'cloudinary',

    fields: [
      { name: 'cloudinaryURL', type: 'text', admin: { hidden: true } },
      { name: 'cloudinaryPublicId', type: 'text', admin: { hidden: true } },
    ],

    generateURL: ({ data }) => data?.cloudinaryURL ?? '',

    // `data` is the doc being created — Payload's HandleUpload type only
    // allows returning its built-in FileData shape, so custom fields like
    // cloudinaryURL must be written onto `data` directly (it's typed `any`).
    handleUpload: async ({ data, file }) => {
      const resourceType = file.mimeType?.startsWith('video/') ? 'video' : 'image'

      const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'media', resource_type: resourceType },
            (error, uploaded) => {
              if (error || !uploaded) return reject(error ?? new Error('Cloudinary upload failed'))
              resolve(uploaded as { secure_url: string; public_id: string })
            },
          )
          stream.end(file.buffer)
        },
      )

      data.cloudinaryURL = result.secure_url
      data.cloudinaryPublicId = result.public_id
    },

    handleDelete: async ({ doc }) => {
      const publicId = (doc as { cloudinaryPublicId?: string }).cloudinaryPublicId
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })
      }
    },

    // Cloudinary URLs are already public/CDN-backed, so reads go straight
    // to Cloudinary (via generateURL) and never hit this route in normal
    // use. Kept only as a fallback for any direct /api/media/file/:filename
    // request.
    staticHandler: async (req, { doc, params }) => {
      let url = (doc as { cloudinaryURL?: string } | undefined)?.cloudinaryURL

      if (!url) {
        const result = await req.payload.find({
          collection: 'media',
          where: { filename: { equals: params.filename } },
          limit: 1,
        })
        url = (result.docs[0] as { cloudinaryURL?: string } | undefined)?.cloudinaryURL
      }

      if (url) {
        return Response.redirect(url, 302)
      }
      return new Response('Not found', { status: 404 })
    },
  })
}
