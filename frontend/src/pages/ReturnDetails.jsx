import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import Field from '../components/Field.jsx'
import Loading from '../components/Loading.jsx'
import { formatDate, todayISO } from '../utils/format.js'

export default function ReturnDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [issue, setIssue] = useState(null)
  const [form, setForm] = useState({ returnDate: todayISO(), bookCondition: 'good', returnNotes: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .get(`/issues/${id}`)
      .then((res) => !cancelled && setIssue(res.data))
      .catch((err) => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [id])

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    setError('')
    const errs = {}
    if (!form.returnDate) errs.returnDate = 'Please select the return date.'
    if (!form.bookCondition) errs.bookCondition = 'Please choose the book condition.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSaving(true)
    try {
      await api.post(`/issues/${id}/return`, form)
      navigate('/returns', { state: { success: 'Book return successful!!' } })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const alreadyReturned = issue && issue.status !== 'ISSUED'

  return (
    <>
      <div className="page-header header-with-btn">
        <div>
          <h1 className="h2">
            <i className="bi bi-journal-arrow-up me-2"></i>Return Book Detail
          </h1>
          <p className="text-muted mb-0">Verify book condition and capture notes before completing the return.</p>
        </div>
        <Link to="/returns" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left"></i> Back to Returns
        </Link>
      </div>

      {error && <Alert key={error}>{error}</Alert>}
      {!issue && !error && <Loading />}
      {alreadyReturned && <Alert type="warning">This book has already been returned.</Alert>}

      {issue && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="mb-3">
                  <h5 className="card-title mb-1">{issue.title}</h5>
                  <p className="card-subtitle text-muted">{issue.author}</p>
                </div>
                <div className="border-top pt-3">
                  <p className="text-muted text-uppercase small mb-2">Quick Details</p>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <i className="bi bi-hash me-2 text-primary"></i>
                      ISBN: <code>{issue.isbn}</code>
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-calendar-event me-2 text-primary"></i>
                      Issued on: <strong>{formatDate(issue.issueDate)}</strong>
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-calendar2-check me-2 text-primary"></i>
                      Due date: <strong>{formatDate(issue.dueDate)}</strong>
                    </li>
                    <li className="mb-0">
                      <i className="bi bi-person me-2 text-primary"></i>
                      Borrower:{' '}
                      <strong>
                        {issue.firstName} {issue.lastName}
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="form-container">
              <h5 className="mb-3">Finalize Return</h5>
              <form onSubmit={onSubmit} noValidate>
                <div className="row">
                  <div className="col-md-6">
                    <Field id="returnDate" type="date" label="Return Date" icon="bi-calendar-check" value={form.returnDate} onChange={onChange} error={errors.returnDate} />
                  </div>
                  <div className="col-md-6">
                    <Field id="bookCondition" as="select" label="Book Condition" icon="bi-clipboard-check" value={form.bookCondition} onChange={onChange} error={errors.bookCondition}>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="damaged">Damaged</option>
                      <option value="lost">Lost</option>
                    </Field>
                  </div>
                </div>

                <Field id="returnNotes" as="textarea" label="Return Notes" icon="bi-card-text" value={form.returnNotes} onChange={onChange} style={{ height: 140 }} />

                <div className="alert alert-info d-flex align-items-center" role="alert">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <span>Record any damages or remarks in the notes to keep the member history up to date.</span>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-modern" disabled={saving || alreadyReturned}>
                    <i className="bi bi-check2-circle"></i>
                    {saving ? 'Saving...' : 'Confirm Return'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
