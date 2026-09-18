import { useParams } from 'react-router-dom'

function ParticipantsPage() {
  const { eventId } = useParams()

  return (
    <section>
      <h1>신청자 · 출석 관리 (#{eventId})</h1>
    </section>
  )
}

export default ParticipantsPage
