import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import Field from '../components/Field.jsx'
import Loading from '../components/Loading.jsx'
import PageHeader from '../components/PageHeader.jsx'

const CATEGORIES = [
  ['fiction', 'Fiction'],
  ['non-fiction', 'Non-fiction'],
  ['science', 'Science'],
  ['technology', 'Technology'],
  ['history', 'History'],
  ['biography', 'Biography'],
  ['mystery', 'Mystery'],
  ['romance', 'Romance'],
]

const EMPTY = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  publisher: '',
  availableCopies: '',
  totalCopies: '1',
}

/** One component for both "Add New Book" and "Update Book" (same as addBook.jsp / editBook.jsp). */
export default function BookForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [serverError, setServerError] = useState('')
  const [alertKey, setAlertKey] = useState(0) // remount alerts so a dismissed one can reappear

  useEffect(() => {
    if (!isEdit) {
      setForm(EMPTY)
      return
    }
    let cancelled = false
    setLoading(true)
    api
      .get(`/books/${id}`)
      .then((res) => {
        if (cancelled) return
        const b = res.data
        setForm({
          title: b.title,
          author: b.author,
          isbn: b.isbn,
          category: b.category,
          publisher: b.publisher,
          availableCopies: String(b.availableCopies),
          totalCopies: String(b.totalCopies),
        })
      })
      .catch((err) => !cancelled && setServerError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Please enter the book title.'
    if (!form.author.trim()) e.author = 'Please enter the author name.'
    if (!form.isbn.trim()) e.isbn = 'Please enter the ISBN number.'
    if (!form.category) e.category = 'Please choose a category.'
    if (!form.publisher.trim()) e.publisher = 'Please enter the publisher name.'

    const total = Number(form.totalCopies)
    if (!form.totalCopies) e.totalCopies = 'Please enter the number of copies.'
    else if (Number.isNaN(total) || total < 1) e.totalCopies = 'Number of copies must be at least 1.'

    if (!isEdit) {
      const avail = Number(form.availableCopies)
      if (!form.availableCopies) e.availableCopies = 'Please enter available copies.'
      else if (Number.isNaN(avail) || avail < 1) e.availableCopies = 'Available copies must be at least 1.'
      else if (!e.totalCopies && avail > total)
        e.availableCopies = 'Available copies must be less than or equal to Number of copies.'
    }
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    setSuccess('')
    setServerError('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      category: form.category,
      publisher: form.publisher.trim(),
      totalCopies: Number(form.totalCopies),
      availableCopies: isEdit ? null : Number(form.availableCopies),
    }

    setSaving(true)
    try {
      if (isEdit) {
        const { data } = await api.put(`/books/${id}`, payload)
        setForm((f) => ({ ...f, availableCopies: String(data.availableCopies), totalCopies: String(data.totalCopies) }))
        setSuccess('Book updated successfully !!!')
        setAlertKey((k) => k + 1)
      } else {
        await api.post('/books', payload)
        navigate('/books', { state: { success: 'Book added successfully!!' } })
      }
    } catch (err) {
      setServerError(errorMessage(err))
      setAlertKey((k) => k + 1)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader icon="bi-book-fill" title={isEdit ? 'Update Book' : 'Add New Book'} />

      {success && (
        <Alert type="success" key={`s${alertKey}`}>
          {success}
        </Alert>
      )}
      {serverError && <Alert key={`e${alertKey}`}>{serverError}</Alert>}

      {loading ? (
        <Loading />
      ) : (
        <div className="form-container">
          <form onSubmit={onSubmit} noValidate>
            <div className="row">
              <div className="col-md-6">
                <Field id="title" label="Book Title" icon="bi-book" value={form.title} onChange={onChange} error={errors.title} />
              </div>
              <div className="col-md-6">
                <Field id="author" label="Author" icon="bi-person" value={form.author} onChange={onChange} error={errors.author} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Field id="isbn" label="ISBN Number" icon="bi-hash" value={form.isbn} onChange={onChange} error={errors.isbn} />
              </div>
              <div className="col-md-6">
                <Field
                  id="category"
                  as="select"
                  label="Category"
                  icon="bi-collection"
                  value={form.category}
                  onChange={onChange}
                  error={errors.category}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {CATEGORIES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Field id="publisher" label="Publisher" icon="bi-building" value={form.publisher} onChange={onChange} error={errors.publisher} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Field
                  id="availableCopies"
                  type="number"
                  label="Available Copies"
                  icon="bi-file-text"
                  value={form.availableCopies}
                  onChange={onChange}
                  error={errors.availableCopies}
                  readOnly={isEdit}
                />
              </div>
              <div className="col-md-6">
                <Field
                  id="totalCopies"
                  type="number"
                  min="1"
                  label="Number of Copies"
                  icon="bi-stack"
                  value={form.totalCopies}
                  onChange={onChange}
                  error={errors.totalCopies}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-modern" disabled={saving}>
                <i className="bi bi-save"></i>
                {saving ? 'Saving...' : isEdit ? 'Update Book' : 'Save Book'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
