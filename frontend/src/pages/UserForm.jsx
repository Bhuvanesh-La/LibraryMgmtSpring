import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import Field from '../components/Field.jsx'
import Loading from '../components/Loading.jsx'
import PageHeader from '../components/PageHeader.jsx'

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', address: '' }

/** One component for "Add New User" and "Update User" (addUser.jsp / editUser.jsp). */
export default function UserForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState(null) // { id, type, text }

  useEffect(() => {
    if (!isEdit) {
      setForm(EMPTY)
      return
    }
    let cancelled = false
    setLoading(true)
    api
      .get(`/users/${id}`)
      .then((res) => {
        if (cancelled) return
        const u = res.data
        setForm({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone || '',
          address: u.address || '',
        })
      })
      .catch((err) => !cancelled && setFlash({ id: Date.now(), type: 'danger', text: errorMessage(err) }))
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
    if (!form.firstName.trim()) e.firstName = 'Please enter the first name.'
    if (!form.lastName.trim()) e.lastName = 'Please enter the last name.'
    if (!form.email.trim()) e.email = isEdit ? 'Email address is missing.' : 'Please enter the email address.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.'
    if (!form.phone.trim()) e.phone = 'Please enter the phone number.'
    if (!form.address.trim()) e.address = 'Please enter the address.'
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    setFlash(null)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, form)
        setFlash({ id: Date.now(), type: 'success', text: 'User updated successfully!!' })
      } else {
        const { data } = await api.post('/users', form)
        navigate('/users', { state: { created: { email: data.user.email, password: data.temporaryPassword } } })
      }
    } catch (err) {
      setFlash({ id: Date.now(), type: 'danger', text: errorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader icon="bi-person-plus" title={isEdit ? 'Update User' : 'Add New User'} />
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
                <Field id="firstName" label="First Name" icon="bi-person" value={form.firstName} onChange={onChange} error={errors.firstName} />
              </div>
              <div className="col-md-6">
                <Field id="lastName" label="Last Name" icon="bi-person" value={form.lastName} onChange={onChange} error={errors.lastName} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Field id="email" type="email" label="Email Address" icon="bi-envelope" value={form.email} onChange={onChange} error={errors.email} readOnly={isEdit} />
              </div>
              <div className="col-md-6">
                <Field id="phone" type="tel" label="Phone Number" icon="bi-telephone" value={form.phone} onChange={onChange} error={errors.phone} />
              </div>
            </div>

            <Field id="address" as="textarea" label="Address" icon="bi-geo-alt" value={form.address} onChange={onChange} error={errors.address} style={{ height: 100 }} />

            <div className="form-actions">
              <button type="submit" className="btn-modern" disabled={saving}>
                <i className="bi bi-person-plus"></i>
                {saving ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
