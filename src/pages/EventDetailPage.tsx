import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { type EventResponse, getEvent } from '../api/events'
import {
  applyParticipation,
  cancelParticipation,
  getMyParticipation,
  type ParticipationResponse,
} from '../api/participations'
import { useAuth } from '../auth/AuthContext'
import '../styles/events.css'

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function EventDetailPage() {
  const { eventId } = useParams()
  const numericEventId = Number(eventId)
  const { isLoggedIn, role } = useAuth()

  const [event, setEvent] = useState<EventResponse | null>(null)
  const [myParticipation, setMyParticipation] = useState<ParticipationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let ignore = false

    async function fetchData() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const eventData = await getEvent(numericEventId)
        const participation = isLoggedIn ? await getMyParticipation(numericEventId) : null

        if (!ignore) {
          setEvent(eventData)
          setMyParticipation(participation)
        }
      } catch (err) {
        if (!ignore) {
          setLoadError(getErrorMessage(err, '행사 정보를 불러오지 못했습니다.'))
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
  }, [numericEventId, isLoggedIn])

  async function handleApply() {
    setActionError(null)
    setIsSubmitting(true)

    try {
      const participation = await applyParticipation(numericEventId)
      setMyParticipation(participation)
    } catch (err) {
      setActionError(getErrorMessage(err, '참가 신청에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCancel() {
    setActionError(null)
    setIsSubmitting(true)

    try {
      await cancelParticipation(numericEventId)
      setMyParticipation(null)
    } catch (err) {
      setActionError(getErrorMessage(err, '참가 취소에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section>
        <p>불러오는 중...</p>
      </section>
    )
  }

  if (loadError || !event) {
    return (
      <section>
        <p className="form-error" role="alert">
          {loadError ?? '행사를 찾을 수 없습니다.'}
        </p>
      </section>
    )
  }

  return (
    <section className="event-detail">
      <h1>{event.title}</h1>
      <p>
        {formatDateTime(event.startAt)} ~ {formatDateTime(event.endAt)}
      </p>
      {event.location && <p>장소: {event.location}</p>}
      {event.capacity !== null && <p>정원: {event.capacity}명</p>}
      {event.content && <p className="event-content">{event.content}</p>}
      {role === 'ADMIN' && (
        <div className="admin-links">
          <Link to={`/events/${event.id}/edit`}>행사 수정</Link>
          <Link to={`/events/${event.id}/participants`}>신청자 · 출석 관리</Link>
        </div>
      )}

      <div className="event-actions">
        {isLoggedIn ? (
          myParticipation ? (
            <button type="button" onClick={handleCancel} disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : '참가 취소'}
            </button>
          ) : (
            <button type="button" onClick={handleApply} disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : '참가 신청'}
            </button>
          )
        ) : (
          <p>
            <Link to="/login">로그인</Link> 후 참가 신청할 수 있습니다.
          </p>
        )}
        {actionError && (
          <p className="form-error" role="alert">
            {actionError}
          </p>
        )}
      </div>
    </section>
  )
}

export default EventDetailPage
