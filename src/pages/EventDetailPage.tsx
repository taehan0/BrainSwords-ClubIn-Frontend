import { useParams } from 'react-router-dom'

function EventDetailPage() {
  const { eventId } = useParams()

  return (
    <section>
      <h1>행사 상세 (#{eventId})</h1>
    </section>
  )
}

export default EventDetailPage
