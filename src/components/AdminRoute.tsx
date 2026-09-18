import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentRole } from '../auth/token'

function AdminRoute() {
  if (getCurrentRole() !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute
