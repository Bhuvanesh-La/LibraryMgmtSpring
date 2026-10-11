import { useCallback, useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import Field from '../components/Field.jsx'
import Loading from '../components/Loading.jsx'
import PageHeader from '../components/PageHeader.jsx'

const EMPTY = { bookId: '', userId: '', dueDate: '', assignmentNotes: '' }

export default function AssignBook() {
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState(null) // { id, type, text }

  const showFlash = (type, text) => setFlash({ id: Date.now(), type, text })

  const load = useCallback(async () => {
    try {
      const [b, u] = await Promise.all([api.get('/books/available'), api.get('/users')])
      setBooks(b.data)
      setUsers(u.data)
      return b.data.length > 0 && u.data.length > 0
    } catch (err) {
      showFlash('danger', errorMessage(err))
      return true
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load().then((ok) => {
      if (!ok) showFlash('danger', 'Either book or user not available. Please try again.')
    })
  }, [load])

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    setFlash(null)
    const errs = {}
    if (!form.bookId) errs.bookId = 'Please choose a book to assign.'
    if (!form.userId) errs.userId = 'Please choose a member.'
    if (!form.dueDate) errs.dueDate = 'Please select the due date.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSaving(true)
    try {
      await api.post('/issues', {
        bookId: Number(form.bookId),
        userId: Number(form.userId),
        dueDate: form.dueDate,
        assignmentNotes: form.assignmentNotes,
      })
      setForm(EMPTY)
      await load() // refresh "available copies" in the dropdown
      showFlash('success', 'Book assign successful!!')
    } catch (err) {
      showFlash('danger', errorMessage(err, 'Book not assigned. Please try again.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader icon="bi-arrow-right-circle" title="Assign Book to Member" />
      {flash && (
        <Alert key={flash.id} type={flash.type}>
          {flash.text}
        </Alert>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="form-container">
          <form onSubmit={onSubmit} noValidate>
            <div className="row">
              <div className="col-md-6">
                <Field id="bookId" as="select" label="Select Book" icon="bi-book-fill" value={form.bookId} onChange={onChange} error={errors.bookId}>
                  <option value="" disabled>
                    Choose a book
                  </option>
                  {books.map((b) => (
                    <option key={b.bookId} value={b.bookId}>
                      {b.title} - {b.author} (Available - {b.availableCopies})
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-6">
                <Field id="userId" as="select" label="Select Member" icon="bi-person-fill" value={form.userId} onChange={onChange} error={errors.userId}>
                  <option value="" disabled>
                    Choose a member
                  </option>
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.firstName} {u.lastName} - {u.email}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Field id="dueDate" type="date" label="Due Date" icon="bi-calendar-event" value={form.dueDate} onChange={onChange} error={errors.dueDate} />
              </div>
            </div>

            <Field
              id="assignmentNotes"
              as="textarea"
              label="Assignment Notes (Optional)"
              icon="bi-card-text"
              value={form.assignmentNotes}
              onChange={onChange}
              style={{ height: 100 }}
            />

            <div className="form-actions">
              <button type="submit" className="btn-modern" disabled={saving}>
                <i className="bi bi-check-circle"></i>
                {saving ? 'Assigning...' : 'Assign Book'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
