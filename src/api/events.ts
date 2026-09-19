import { apiClient } from './client'

export interface EventResponse {
  id: number
  title: string
  content: string | null
  location: string | null
  startAt: string
  endAt: string
  capacity: number | null
}

export async function getEvents(): Promise<EventResponse[]> {
  const { data } = await apiClient.get<EventResponse[]>('/api/events')
  return data
}

export async function getEvent(eventId: number): Promise<EventResponse> {
  const { data } = await apiClient.get<EventResponse>(`/api/events/${eventId}`)
  return data
}
