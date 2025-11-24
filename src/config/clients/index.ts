import type { BusinessConfig } from '../business.types'
import { demoBarberConfig } from './demo-barber.config'
import { demoElectricianConfig } from './demo-electrician.config'

/**
 * Client configuration registry
 * Maps slug to BusinessConfig
 */
export const clients: Record<string, BusinessConfig> = {
  'demo-barber': demoBarberConfig,
  'demo-electrician': demoElectricianConfig,
}

/**
 * Get client config by slug
 * @param slug - Client identifier (e.g., 'demo-barber')
 * @returns BusinessConfig or null if not found
 */
export function getClientConfig(slug: string): BusinessConfig | null {
  return clients[slug] || null
}

/**
 * Get client config by custom domain
 * @param domain - Custom domain (e.g., 'mueller-barbershop.de')
 * @returns BusinessConfig or null if not found
 */
export function getClientConfigByDomain(domain: string): BusinessConfig | null {
  return (
    Object.values(clients).find((config) => config.customDomain === domain) ||
    null
  )
}

/**
 * Get all client configs (for admin listing)
 */
export function getAllClients(): BusinessConfig[] {
  return Object.values(clients)
}
