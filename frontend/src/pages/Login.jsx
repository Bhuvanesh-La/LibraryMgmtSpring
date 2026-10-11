import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // the auth stylesheet styles the page through a body class
  useEffect(() => {
    document.body.classList.add('auth-page')
    return () => document.body.classList.remove('auth-page')
  }, [])

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.username.trim()) errs.username = 'Please enter username'
    if (!form.password.trim()) errs.password = 'Please enter password'
    setErrors(errs)
    setServerError('')
    if (Object.keys(errs).length) return

    setSubmitting(true)
    try {
      await login(form.username.trim(), form.password)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setServerError(errorMessage(err, 'Unable to sign in. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <i className="bi bi-book-half"></i>
          </div>
          <h3 className="login-title">Online Library</h3>
          <p className="login-subtitle">Please sign in to your library account</p>
        </div>

        {serverError && <Alert key={serverError}>{serverError}</Alert>}

        <form onSubmit={onSubmit} noValidate>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={onChange}
              autoComplete="username"
            />
            <label htmlFor="username">
              <i className="bi bi-person-fill me-2"></i>Username
            </label>
            <div className="text-danger small">{errors.username}</div>
          </div>

          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
            />
            <label htmlFor="password">
              <i className="bi bi-lock-fill me-2"></i>Password
            </label>
            <div className="text-danger small">{errors.password}</div>
          </div>

          <button type="submit" className="btn btn-login" disabled={submitting}>
            <i className="bi bi-box-arrow-in-right me-2"></i>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
