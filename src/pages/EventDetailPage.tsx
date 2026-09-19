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
import { dangerButtonClass, errorTextClass, linkClass, primaryButtonClass } from '../styles/ui'

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
    return <p className="text-neutral-500 dark:text-neutral-400">불러오는 중...</p>
  }

  if (loadError || !event) {
    return (
      <p role="alert" className={errorTextClass}>
        {loadError ?? '행사를 찾을 수 없습니다.'}
      </p>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">{event.title}</h1>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        <span>
          {formatDateTime(event.startAt)} ~ {formatDateTime(event.endAt)}
        </span>
        {event.location && <span>· {event.location}</span>}
        {event.capacity !== null && <span>· 정원 {event.capacity}명</span>}
      </div>

      {event.content && (
        <p className="mt-6 whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">{event.content}</p>
      )}

      {role === 'ADMIN' && (
        <div className="mt-4 flex gap-4 text-sm">
          <Link to={`/events/${event.id}/edit`} className={linkClass}>
            행사 수정
          </Link>
          <Link to={`/events/${event.id}/participants`} className={linkClass}>
            신청자 · 출석 관리
          </Link>
        </div>
      )}

      <div className="mt-8">
        {isLoggedIn ? (
          myParticipation ? (
            <button type="button" onClick={handleCancel} disabled={isSubmitting} className={dangerButtonClass}>
              {isSubmitting ? '처리 중...' : '참가 취소'}
            </button>
          ) : (
            <button type="button" onClick={handleApply} disabled={isSubmitting} className={primaryButtonClass}>
              {isSubmitting ? '처리 중...' : '참가 신청'}
            </button>
          )
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400">
            <Link to="/login" className={linkClass}>
              로그인
            </Link>{' '}
            후 참가 신청할 수 있습니다.
          </p>
        )}
        {actionError && (
          <p role="alert" className={`mt-2 ${errorTextClass}`}>
            {actionError}
          </p>
        )}
      </div>
    </div>
  )
}

export default EventDetailPage
