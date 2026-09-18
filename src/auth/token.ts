export type Role = 'MEMBER' | 'ADMIN'

interface AccessTokenPayload {
  sub: string
  role: Role
  iat: number
  exp: number
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload)) as AccessTokenPayload
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return getAccessToken() !== null
}

export function getCurrentRole(): Role | null {
  const token = getAccessToken()
  if (!token) return null
  return decodeAccessToken(token)?.role ?? null
}
