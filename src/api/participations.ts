import { apiClient } from './client'

export type ParticipationStatus = 'APPLIED' | 'CANCELLED'
export type AttendanceStatus = 'NOT_CHECKED' | 'ATTENDED' | 'ABSENT'

export interface ParticipationResponse {
  id: number
  eventId: number
  memberId: number
  loginId: string
  status: ParticipationStatus
  attendanceStatus: AttendanceStatus
  appliedAt: string
}

export async function getMyParticipation(eventId: number): Promise<ParticipationResponse | null> {
  const response = await apiClient.get<ParticipationResponse>(`/api/events/${eventId}/participations/me`)
  return response.status === 204 ? null : response.data
}

export async function applyParticipation(eventId: number): Promise<ParticipationResponse> {
  const { data } = await apiClient.post<ParticipationResponse>(`/api/events/${eventId}/participations`)
  return data
}

export async function cancelParticipation(eventId: number): Promise<void> {
  await apiClient.delete(`/api/events/${eventId}/participations`)
}

export async function getParticipants(eventId: number): Promise<ParticipationResponse[]> {
  const { data } = await apiClient.get<ParticipationResponse[]>(`/api/events/${eventId}/participations`)
  return data
}

export async function checkAttendance(
  eventId: number,
  memberId: number,
  attendanceStatus: AttendanceStatus,
): Promise<ParticipationResponse> {
  const { data } = await apiClient.patch<ParticipationResponse>(
    `/api/events/${eventId}/participations/${memberId}/attendance`,
    { attendanceStatus },
  )
  return data
}
