import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import { getErrorMessage } from '../api/errors'
import { errorTextClass, inputClass, labelClass, linkClass, primaryButtonClass } from '../styles/ui'

function SignupPage() {
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
      await signup({ loginId, password })
      navigate('/login')
    } catch (err) {
      setError(getErrorMessage(err, '회원가입에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">회원가입</h1>
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
            autoComplete="new-password"
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
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        이미 계정이 있으신가요? <Link to="/login" className={linkClass}>로그인</Link>
      </p>
    </div>
  )
}

export default SignupPage
