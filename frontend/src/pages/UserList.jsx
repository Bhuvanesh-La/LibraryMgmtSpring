import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api, errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import Loading from '../components/Loading.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function UserList() {
  const location = useLocation()
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const created = location.state?.created // { email, password } after "Add User"

  useEffect(() => {
    let cancelled = false
    api
      .get('/users')
      .then((res) => !cancelled && setUsers(res.data))
      .catch((err) => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <PageHeader
        icon="bi-people-fill"
        title="User Management"
        actionTo="/users/add"
        actionIcon="bi-person-plus-fill"
        actionLabel="Add New User"
      />

      {created && (
        <Alert type="success">
          User created successfully. Temporary password for <strong>{created.email}</strong>:{' '}
          <code className="fs-6">{created.password}</code> &mdash; note it down now, it will not be shown again.
        </Alert>
      )}
      {location.state?.success && <Alert type="success">{location.state.success}</Alert>}
      {error && <Alert>{error}</Alert>}

      <div className="table-container">
        <div className="table-responsive">
          {!users && !error && <Loading />}
          {users && users.length === 0 && <div className="p-3">No user found</div>}
          {users && users.length > 0 && (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.userId}>
                    <td>
                      <span className="badge bg-primary">{i + 1}</span>
                    </td>
                    <td>
                      <strong>{u.firstName}</strong>
                    </td>
                    <td>{u.lastName}</td>
                    <td>{u.email}</td>
                    <td>
                      <Link to={`/users/${u.userId}/edit`} className="action-btn edit" title="Edit User">
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
