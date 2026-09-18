import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">BS ClubIn</Link>
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
