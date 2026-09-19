import { useNavigate } from 'react-router-dom'
import { createEvent, type EventRequest } from '../api/events'
import EventForm from '../components/EventForm'

function EventCreatePage() {
  const navigate = useNavigate()

  async function handleSubmit(request: EventRequest) {
    const created = await createEvent(request)
    navigate(`/events/${created.id}`)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">행사 등록</h1>
      <EventForm
        submitLabel="행사 등록"
        pendingLabel="등록 중..."
        errorFallback="행사 등록에 실패했습니다."
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default EventCreatePage
