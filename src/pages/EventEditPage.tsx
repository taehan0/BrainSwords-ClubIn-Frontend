import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { type EventRequest, getEvent, updateEvent } from '../api/events'
import EventForm, { type EventFormValues } from '../components/EventForm'
import { errorTextClass } from '../styles/ui'

function toDateTimeLocal(value: string): string {
  return value.slice(0, 16)
}

function EventEditPage() {
  const { eventId } = useParams()
  const numericEventId = Number(eventId)
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState<EventFormValues | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function fetchEvent() {
      setIsLoading(true)
      setLoadError(null)

      try {
        const event = await getEvent(numericEventId)
        if (!ignore) {
          setInitialValues({
            title: event.title,
            content: event.content ?? '',
            location: event.location ?? '',
            startAt: toDateTimeLocal(event.startAt),
            endAt: toDateTimeLocal(event.endAt),
            capacity: event.capacity === null ? '' : String(event.capacity),
          })
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

    fetchEvent()

    return () => {
      ignore = true
    }
  }, [numericEventId])

  async function handleSubmit(request: EventRequest) {
    await updateEvent(numericEventId, request)
    navigate(`/events/${numericEventId}`)
  }

  if (isLoading) {
    return <p className="text-neutral-500 dark:text-neutral-400">불러오는 중...</p>
  }

  if (loadError || !initialValues) {
    return (
      <p role="alert" className={errorTextClass}>
        {loadError ?? '행사를 찾을 수 없습니다.'}
      </p>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">행사 수정</h1>
      <EventForm
        initialValues={initialValues}
        submitLabel="수정 완료"
        pendingLabel="수정 중..."
        errorFallback="행사 수정에 실패했습니다."
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default EventEditPage
