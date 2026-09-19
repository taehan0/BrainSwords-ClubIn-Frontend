import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { getErrorMessage } from '../api/errors'
import { useAuth } from '../auth/AuthContext'
import { errorTextClass, inputClass, labelClass, linkClass, primaryButtonClass } from '../styles/ui'

function LoginPage() {
  const { login: setLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await login({ loginId, password })
      setLoggedIn(response.accessToken)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err, '로그인에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">로그인</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="loginId" className={labelClass}>
          아이디
          <input
            id="loginId"
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            autoComplete="username"
            required
            className={inputClass}
          />
        </label>
        <label htmlFor="password" className={labelClass}>
          비밀번호
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </label>
        {error && (
          <p role="alert" className={errorTextClass}>
            {error}
          </p>
        )}
        <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        계정이 없으신가요? <Link to="/signup" className={linkClass}>회원가입</Link>
      </p>
    </div>
  )
}

export default LoginPage
