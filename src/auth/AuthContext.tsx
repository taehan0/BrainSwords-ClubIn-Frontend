import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'
import { decodeAccessToken, getAccessToken, type Role } from './token'

interface AuthState {
  isLoggedIn: boolean
  role: Role | null
  login: (accessToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState(getAccessToken())

  const value = useMemo<AuthState>(() => {
    return {
      isLoggedIn: accessToken !== null,
      role: accessToken ? (decodeAccessToken(accessToken)?.role ?? null) : null,
      login: (token: string) => {
        localStorage.setItem('accessToken', token)
        setAccessToken(token)
      },
      logout: () => {
        localStorage.removeItem('accessToken')
        setAccessToken(null)
      },
    }
  }, [accessToken])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
