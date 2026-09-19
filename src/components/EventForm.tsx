import { type FormEvent, useState } from 'react'
import type { EventRequest } from '../api/events'
import { getErrorMessage } from '../api/errors'
import { errorTextClass, inputClass, labelClass, primaryButtonClass } from '../styles/ui'

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
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <label htmlFor="title" className={labelClass}>
        제목
        <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required className={inputClass} />
      </label>
      <label htmlFor="location" className={labelClass}>
        장소
        <input id="location" value={location} onChange={(event) => setLocation(event.target.value)} className={inputClass} />
      </label>
      <label htmlFor="startAt" className={labelClass}>
        시작 시각
        <input
          id="startAt"
          type="datetime-local"
          value={startAt}
          onChange={(event) => setStartAt(event.target.value)}
          required
          className={inputClass}
        />
      </label>
      <label htmlFor="endAt" className={labelClass}>
        종료 시각
        <input
          id="endAt"
          type="datetime-local"
          value={endAt}
          onChange={(event) => setEndAt(event.target.value)}
          required
          className={inputClass}
        />
      </label>
      <label htmlFor="capacity" className={labelClass}>
        정원 (선택)
        <input
          id="capacity"
          type="number"
          min={1}
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          className={inputClass}
        />
      </label>
      <label htmlFor="content" className={labelClass}>
        내용
        <textarea
          id="content"
          rows={5}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className={`${inputClass} resize-y`}
        />
      </label>
      {error && (
        <p role="alert" className={errorTextClass}>
          {error}
        </p>
      )}
      <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
        {isSubmitting ? pendingLabel : submitLabel}
      </button>
    </form>
  )
}

export default EventForm
