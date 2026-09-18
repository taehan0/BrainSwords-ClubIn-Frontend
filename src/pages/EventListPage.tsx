import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { type EventResponse, getEvents } from '../api/events'
import { getErrorMessage } from '../api/errors'
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
    <section>
      <div className="page-header">
        <h1>행사 목록</h1>
        {role === 'ADMIN' && <Link to="/events/new">행사 등록</Link>}
      </div>

      {isLoading && <p>불러오는 중...</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!isLoading && !error && events.length === 0 && <p>등록된 행사가 없습니다.</p>}

      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-card">
            <Link to={`/events/${event.id}`}>
              <h2>{event.title}</h2>
              <p>
                {formatDateTime(event.startAt)} ~ {formatDateTime(event.endAt)}
              </p>
              {event.location && <p>{event.location}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default EventListPage
