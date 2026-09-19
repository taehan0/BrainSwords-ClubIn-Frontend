import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { type EventResponse, getEvent } from '../api/events'
import {
  type AttendanceStatus,
  checkAttendance,
  getParticipants,
  type ParticipationResponse,
} from '../api/participations'
import '../styles/participants.css'

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_LABEL: Record<ParticipationResponse['status'], string> = {
  APPLIED: '신청',
  CANCELLED: '취소',
}

const ATTENDANCE_LABEL: Record<AttendanceStatus, string> = {
  NOT_CHECKED: '미체크',
  ATTENDED: '출석',
  ABSENT: '결석',
}

const ATTENDANCE_OPTIONS: AttendanceStatus[] = ['ATTENDED', 'ABSENT', 'NOT_CHECKED']

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
    return (
      <section>
        <p>불러오는 중...</p>
      </section>
    )
  }

  return (
    <section className="participants-page">
      <h1>신청자 · 출석 관리{event ? ` — ${event.title}` : ''}</h1>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {participants.length === 0 ? (
        <p>신청자가 없습니다.</p>
      ) : (
        <table className="participants-table">
          <thead>
            <tr>
              <th>아이디</th>
              <th>신청 상태</th>
              <th>출석 상태</th>
              <th>신청 일시</th>
              <th>출석 체크</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant.id}>
                <td>{participant.loginId}</td>
                <td>{STATUS_LABEL[participant.status]}</td>
                <td>{ATTENDANCE_LABEL[participant.attendanceStatus]}</td>
                <td>{formatDateTime(participant.appliedAt)}</td>
                <td>
                  <div className="attendance-actions">
                    {ATTENDANCE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={participant.attendanceStatus === option ? 'active' : ''}
                        disabled={
                          participant.status !== 'APPLIED' || updatingMemberId === participant.memberId
                        }
                        onClick={() => handleAttendanceChange(participant.memberId, option)}
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
      )}
    </section>
  )
}

export default ParticipantsPage
