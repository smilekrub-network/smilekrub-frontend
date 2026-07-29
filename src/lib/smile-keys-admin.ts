import { apiJson } from '#/lib/api-client'

export interface SmileKeyRow {
  id: string
  code: string
  createdAt: string
  usedAt: string | null
  usedByEmail: string | null
  usedByMinecraftUsername: string | null
}

export function listSmileKeys() {
  return apiJson<Array<SmileKeyRow>>('/api/admin/smilekeys')
}

export function createSmileKey() {
  return apiJson<SmileKeyRow>('/api/admin/smilekeys', { method: 'POST' })
}

export function deleteSmileKey(id: string) {
  return apiJson<{ ok: true }>(`/api/admin/smilekeys/${id}`, { method: 'DELETE' })
}
