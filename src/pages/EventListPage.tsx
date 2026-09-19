import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { type EventResponse, getEvents } from '../api/events'
import { getErrorMessage } from '../api/errors'
import { useAuth } from '../auth/AuthContext'
import { errorTextClass, primaryButtonClass } from '../styles/ui'

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function EventListPage() {
  const { role } = useAuth()

  const [events, setEvents] = useState<EventResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function fetchEvents() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getEvents()
        if (!ignore) {
          setEvents(data)
        }
      } catch (err) {
        if (!ignore) {
          setError(getErrorMessage(err, '행사 목록을 불러오지 못했습니다.'))
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchEvents()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">행사 목록</h1>
        {role === 'ADMIN' && (
          <Link to="/events/new" className={primaryButtonClass}>
            행사 등록
          </Link>
        )}
      </div>

      {isLoading && <p className="text-neutral-500 dark:text-neutral-400">불러오는 중...</p>}
      {error && (
        <p role="alert" className={errorTextClass}>
          {error}
        </p>
      )}
      {!isLoading && !error && events.length === 0 && (
        <p className="text-neutral-500 dark:text-neutral-400">등록된 행사가 없습니다.</p>
      )}

      <ul className="flex flex-col gap-3">
        {events.map((event) => (
          <li key={event.id}>
            <Link
              to={`/events/${event.id}`}
              className="block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-violet-400 hover:bg-violet-50/60 dark:border-neutral-800 dark:hover:border-violet-600 dark:hover:bg-violet-950/20"
            >
              <h2 className="text-lg font-medium">{event.title}</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {formatDateTime(event.startAt)} ~ {formatDateTime(event.endAt)}
              </p>
              {event.location && (
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{event.location}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventListPage
