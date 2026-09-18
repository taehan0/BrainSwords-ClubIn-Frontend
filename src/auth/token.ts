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

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload)) as AccessTokenPayload
  } catch {
    return null
  }
}
