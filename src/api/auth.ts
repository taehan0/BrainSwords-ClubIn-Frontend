import { apiClient } from './client'

export interface SignupRequest {
  loginId: string
  password: string
}

export interface SignupResponse {
  memberId: number
  loginId: string
}

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  memberId: number
  loginId: string
}

export async function signup(request: SignupRequest): Promise<SignupResponse> {
  const { data } = await apiClient.post<SignupResponse>('/api/auth/signup', request)
  return data
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/api/auth/login', request)
  return data
}
