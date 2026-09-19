import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Layout() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold">
            BS ClubIn
          </Link>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              로그아웃
            </button>
          ) : (
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link
                to="/login"
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-violet-600 px-3 py-1.5 text-white transition-colors hover:bg-violet-500"
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
