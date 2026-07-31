export type Json = string | number | boolean | null | undefined | { [key: string]: Json } | Array<Json>

export interface GameModeStats {
  total_wins?: number
  total_lost?: number
  total_game_played?: number
  total_play_time?: number
  win_streak?: number
  last_update?: string
  [key: string]: Json | undefined
}

export interface PlayerDoc {
  _id: string
  name: string
  uuid: string
  registered?: string
  last_online?: string
  total_online_seconds?: number
  currently_in_network_instance_type?: string
  server?: {
    network?: {
      account?: { exp?: number; level?: number; rank?: number; nickname?: string | null }
      cosmetics?: Record<string, Array<string>>
      gadgets?: Record<string, number>
      friends?: { all?: Array<string>; blacklist?: Array<string>; best?: Array<string> }
      staff?: { status?: string }
      [key: string]: Json | undefined
    }
    hub?: { smilebox?: number; salt?: number }
    currency?: { smileplex?: number; smiles?: number }
    survival?: Record<string, Json>
    ultra_hardcore?: GameModeStats
    lava_jumping?: GameModeStats
    dragon_survival?: GameModeStats
    [key: string]: Json | undefined
  }
  [key: string]: Json | undefined
}
