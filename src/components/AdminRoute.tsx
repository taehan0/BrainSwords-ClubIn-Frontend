import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function AdminRoute() {
  const { role } = useAuth()

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute
