import type { minecraftTagVariants } from '@/components/ui/minecraft-menu'
import type { VariantProps } from 'class-variance-authority'

type TagColor = NonNullable<VariantProps<typeof minecraftTagVariants>['color']>

export interface RankDef {
  threshold: number
  name: string
  /** Minecraft color code name (e.g. "RED") or a literal hex value (e.g. "#fc5e03"). */
  colorCode: string
}

/** Mirrors the server-side rank enum — thresholds must stay sorted descending. */
export const RANKS: Array<RankDef> = [
  { threshold: 1990, name: 'OWNER', colorCode: 'RED' },
  { threshold: 1980, name: 'DEV', colorCode: 'WHITE' },
  { threshold: 1970, name: 'MOD', colorCode: 'GOLD' },
  { threshold: 1960, name: 'BUILDER', colorCode: 'DARK_GREEN' },
  { threshold: 1950, name: 'HELPER', colorCode: 'BLUE' },
  { threshold: 790, name: 'Media.', colorCode: '#fc5e03' },
  { threshold: 30, name: 'Gold', colorCode: '#FFD700' },
  { threshold: 20, name: 'Sliver', colorCode: '#C0C0C0' },
  { threshold: 10, name: 'Iron', colorCode: '#888888' },
  { threshold: 0, name: 'Default', colorCode: '' },
]

const MC_COLOR_TO_TAG: Record<string, TagColor> = {
  RED: 'red',
  DARK_RED: 'dark-red',
  GOLD: 'gold',
  YELLOW: 'yellow',
  WHITE: 'white',
  GRAY: 'gray',
  DARK_GRAY: 'dark-gray',
  BLUE: 'blue',
  DARK_BLUE: 'dark-blue',
  GREEN: 'green',
  DARK_GREEN: 'dark-green',
  AQUA: 'aqua',
  PURPLE: 'purple',
  DARK_PURPLE: 'dark-purple',
}

export function rankForValue(rank: number): RankDef {
  return RANKS.find((r) => rank >= r.threshold) ?? RANKS[RANKS.length - 1]
}

/** Hex codes (custom ranks like Media./Gold/Sliver/Iron) render via inline style; named codes map to a MinecraftTag color. */
export function rankTagProps(rank: RankDef): { color?: TagColor; style?: { color: string } } {
  if (rank.colorCode.startsWith('#')) return { style: { color: rank.colorCode } }
  return { color: MC_COLOR_TO_TAG[rank.colorCode] }
}
