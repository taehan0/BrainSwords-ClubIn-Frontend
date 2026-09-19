import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../api/events'
import { getErrorMessage } from '../api/errors'
import '../styles/forms.css'

function EventCreatePage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [capacity, setCapacity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const created = await createEvent({
        title,
        content,
        location,
        startAt,
        endAt,
        capacity: capacity === '' ? null : Number(capacity),
      })
      navigate(`/events/${created.id}`)
    } catch (err) {
      setError(getErrorMessage(err, '행사 등록에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <h1>행사 등록</h1>
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
          <textarea
            id="content"
            rows={5}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '행사 등록'}
        </button>
      </form>
    </section>
  )
}

export default EventCreatePage
