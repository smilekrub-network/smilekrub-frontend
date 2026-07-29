import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export const ROLES = ['USER', 'ADMIN'] as const
export type UserRole = (typeof ROLES)[number]

export const authClient = createAuthClient({
  baseURL: API_URL,
  // The API is on a different origin, so the session cookie must be sent
  // explicitly on every request.
  fetchOptions: { credentials: 'include' },
  plugins: [
    // smilekrub-backend is a separate repo, so `typeof auth` cannot be imported
    // to infer this — the extra user field is declared by hand instead.
    inferAdditionalFields({
      user: { role: { type: 'string' } },
    }),
  ],
})

export interface SessionUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  role: UserRole
  createdAt: string
}

export interface AuthSession {
  user: SessionUser
}

export function isAdmin(session: AuthSession | null): boolean {
  return session?.user.role === 'ADMIN'
}

/** Initials used by the avatar fallback, e.g. "Peeranat S" -> "PS". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const initials = parts.map((p) => p[0] ?? '').join('')
  return initials.toUpperCase() || 'SK'
}
