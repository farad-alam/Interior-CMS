import configPromise from '@/payload.config'
import { getPayload } from 'payload'

/** Shared Payload Local API client for server components. */
export const getPayloadClient = async () => getPayload({ config: configPromise })
