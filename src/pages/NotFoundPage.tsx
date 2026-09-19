import { Link } from 'react-router-dom'
import { linkClass } from '../styles/ui'

function NotFoundPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3">
        <Link to="/" className={linkClass}>
          홈으로 돌아가기
        </Link>
      </p>
    </div>
  )
}

export default NotFoundPage
