import { type FormEvent, useState } from 'react'
import type { EventRequest } from '../api/events'
import { getErrorMessage } from '../api/errors'
import '../styles/forms.css'

export interface EventFormValues {
  title: string
  content: string
  location: string
  startAt: string
  endAt: string
  capacity: string
}

interface EventFormProps {
  initialValues?: EventFormValues
  submitLabel: string
  pendingLabel: string
  errorFallback: string
  onSubmit: (request: EventRequest) => Promise<void>
}

function EventForm({ initialValues, submitLabel, pendingLabel, errorFallback, onSubmit }: EventFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [location, setLocation] = useState(initialValues?.location ?? '')
  const [startAt, setStartAt] = useState(initialValues?.startAt ?? '')
  const [endAt, setEndAt] = useState(initialValues?.endAt ?? '')
  const [capacity, setCapacity] = useState(initialValues?.capacity ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({
        title,
        content,
        location,
        startAt,
        endAt,
        capacity: capacity === '' ? null : Number(capacity),
      })
    } catch (err) {
      setError(getErrorMessage(err, errorFallback))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="title">
        제목
        <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>
      <label htmlFor="location">
        장소
        <input id="location" value={location} onChange={(event) => setLocation(event.target.value)} />
      </label>
      <label htmlFor="startAt">
        시작 시각
        <input
          id="startAt"
          type="datetime-local"
          value={startAt}
          onChange={(event) => setStartAt(event.target.value)}
          required
        />
      </label>
      <label htmlFor="endAt">
        종료 시각
        <input
          id="endAt"
          type="datetime-local"
          value={endAt}
          onChange={(event) => setEndAt(event.target.value)}
          required
        />
      </label>
      <label htmlFor="capacity">
        정원 (선택)
        <input
          id="capacity"
          type="number"
          min={1}
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
        />
      </label>
      <label htmlFor="content">
        내용
        <textarea id="content" rows={5} value={content} onChange={(event) => setContent(event.target.value)} />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? pendingLabel : submitLabel}
      </button>
    </form>
  )
}

export default EventForm
