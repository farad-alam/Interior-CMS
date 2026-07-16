import type { Access } from 'payload'

/**
 * Allow the operation only for a logged-in dashboard user.
 * Public read is granted per-collection with `read: () => true`;
 * everything else defaults to this.
 */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
