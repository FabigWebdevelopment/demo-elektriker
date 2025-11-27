import { FunnelConfig, FunnelId } from '../types'
import { smartHomeFunnelConfig } from './smart-home'
import { elektroFunnelConfig } from './elektro'
import { sicherheitFunnelConfig } from './sicherheit'
import { wallboxFunnelConfig } from './wallbox'

export const funnelConfigs: Record<FunnelId, FunnelConfig> = {
  'smart-home-beratung': smartHomeFunnelConfig,
  'elektro-anfrage': elektroFunnelConfig,
  'sicherheit-beratung': sicherheitFunnelConfig,
  'wallbox-anfrage': wallboxFunnelConfig,
}

export function getFunnelConfig(id: FunnelId): FunnelConfig {
  return funnelConfigs[id]
}

export {
  smartHomeFunnelConfig,
  elektroFunnelConfig,
  sicherheitFunnelConfig,
  wallboxFunnelConfig,
}
