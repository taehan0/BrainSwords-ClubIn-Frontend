import { useParams } from 'react-router-dom'

function EventEditPage() {
  const { eventId } = useParams()

  return (
    <section>
      <h1>행사 수정 (#{eventId})</h1>
    </section>
  )
}

export default EventEditPage
