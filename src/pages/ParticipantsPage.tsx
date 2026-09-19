import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { type EventResponse, getEvent } from '../api/events'
import {
  type AttendanceStatus,
  checkAttendance,
  getParticipants,
  type ParticipationResponse,
  type ParticipationStatus,
} from '../api/participations'
import { errorTextClass } from '../styles/ui'

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_LABEL: Record<ParticipationStatus, string> = {
  APPLIED: '신청',
  CANCELLED: '취소',
}

const ATTENDANCE_LABEL: Record<AttendanceStatus, string> = {
  NOT_CHECKED: '미체크',
  ATTENDED: '출석',
  ABSENT: '결석',
}

const ATTENDANCE_OPTIONS: AttendanceStatus[] = ['ATTENDED', 'ABSENT', 'NOT_CHECKED']

const BADGE_BASE = 'inline-flex rounded-full px-2 py-0.5 text-xs font-medium'

function statusBadgeClass(status: ParticipationStatus): string {
  return status === 'APPLIED'
    ? `${BADGE_BASE} bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400`
    : `${BADGE_BASE} bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400`
}

function attendanceBadgeClass(status: AttendanceStatus): string {
  if (status === 'ATTENDED') {
    return `${BADGE_BASE} bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400`
  }
  if (status === 'ABSENT') {
    return `${BADGE_BASE} bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400`
  }
  return `${BADGE_BASE} bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400`
}

function ParticipantsPage() {
  const { eventId } = useParams()
  const numericEventId = Number(eventId)

  const [event, setEvent] = useState<EventResponse | null>(null)
  const [participants, setParticipants] = useState<ParticipationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingMemberId, setUpdatingMemberId] = useState<number | null>(null)

  useEffect(() => {
    let ignore = false

    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        const [eventData, participantsData] = await Promise.all([
          getEvent(numericEventId),
          getParticipants(numericEventId),
        ])

        if (!ignore) {
          setEvent(eventData)
          setParticipants(participantsData)
        }
      } catch (err) {
        if (!ignore) {
          setError(getErrorMessage(err, '신청자 목록을 불러오지 못했습니다.'))
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      ignore = true
    }
  }, [numericEventId])

  async function handleAttendanceChange(memberId: number, attendanceStatus: AttendanceStatus) {
    setUpdatingMemberId(memberId)
    setError(null)

    try {
      const updated = await checkAttendance(numericEventId, memberId, attendanceStatus)
      setParticipants((prev) =>
        prev.map((participant) => (participant.memberId === memberId ? updated : participant)),
      )
    } catch (err) {
      setError(getErrorMessage(err, '출석 체크에 실패했습니다.'))
    } finally {
      setUpdatingMemberId(null)
    }
  }

  if (isLoading) {
    return <p className="text-neutral-500 dark:text-neutral-400">불러오는 중...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">신청자 · 출석 관리{event ? ` — ${event.title}` : ''}</h1>

      {error && (
        <p role="alert" className={`mt-3 ${errorTextClass}`}>
          {error}
        </p>
      )}

      {participants.length === 0 ? (
        <p className="mt-6 text-neutral-500 dark:text-neutral-400">신청자가 없습니다.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                <th className="py-2 pr-4 font-medium">아이디</th>
                <th className="py-2 pr-4 font-medium">신청 상태</th>
                <th className="py-2 pr-4 font-medium">출석 상태</th>
                <th className="py-2 pr-4 font-medium">신청 일시</th>
                <th className="py-2 font-medium">출석 체크</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr
                  key={participant.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-900"
                >
                  <td className="py-3 pr-4">{participant.loginId}</td>
                  <td className="py-3 pr-4">
                    <span className={statusBadgeClass(participant.status)}>
                      {STATUS_LABEL[participant.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={attendanceBadgeClass(participant.attendanceStatus)}>
                      {ATTENDANCE_LABEL[participant.attendanceStatus]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400">
                    {formatDateTime(participant.appliedAt)}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1.5">
                      {ATTENDANCE_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          disabled={
                            participant.status !== 'APPLIED' || updatingMemberId === participant.memberId
                          }
                          onClick={() => handleAttendanceChange(participant.memberId, option)}
                          className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            participant.attendanceStatus === option
                              ? 'border-violet-600 bg-violet-600 text-white'
                              : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                          }`}
                        >
                          {ATTENDANCE_LABEL[option]}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ParticipantsPage
