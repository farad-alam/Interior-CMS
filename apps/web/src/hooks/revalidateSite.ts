import type { GlobalAfterChangeHook } from 'payload'

/**
 * When Site Settings change (hero variant, branding, hero/about content),
 * immediately refresh the ISR cache so the edit shows on the live site right
 * away instead of waiting for the revalidate window. Dynamically imports
 * next/cache and is wrapped in try/catch so it can never break the Payload
 * CLI (migrations) or a build, where next/cache isn't in a request scope.
 */
export const revalidateSite: GlobalAfterChangeHook = async ({ req }) => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch (err) {
    req.payload.logger.error({ err }, 'revalidateSite: could not revalidate')
  }
}
