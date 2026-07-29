import { apiJson } from '#/lib/api-client'

export interface MojangLookup {
  username: string
  uuid: string
}

export interface PlayerRegistration {
  id: string
  userId: string
  minecraftUsername: string
  minecraftUuid: string
  smileKeyId: string
  createdAt: string
}

export type RegisterErrorCode =
  | 'MC_ACCOUNT_NOT_FOUND'
  | 'MC_ACCOUNT_ALREADY_LINKED'
  | 'INVALID_SMILEKEY'
  | 'SMILEKEY_ALREADY_USED'
  | 'ALREADY_REGISTERED'

export function lookupMinecraft(username: string) {
  return apiJson<MojangLookup>(`/api/mc/lookup?username=${encodeURIComponent(username)}`)
}

export function submitRegistration(body: { minecraftUsername: string; smileKey: string }) {
  return apiJson<PlayerRegistration>('/api/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
