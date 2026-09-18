import { Route, Routes } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'
import EventCreatePage from './pages/EventCreatePage'
import EventDetailPage from './pages/EventDetailPage'
import EventEditPage from './pages/EventEditPage'
import EventListPage from './pages/EventListPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ParticipantsPage from './pages/ParticipantsPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<EventListPage />} />
        <Route path="events/:eventId" element={<EventDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route element={<AdminRoute />}>
          <Route path="events/new" element={<EventCreatePage />} />
          <Route path="events/:eventId/edit" element={<EventEditPage />} />
          <Route path="events/:eventId/participants" element={<ParticipantsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
