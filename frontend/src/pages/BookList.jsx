import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api, errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import Loading from '../components/Loading.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function BookList() {
  const location = useLocation()
  const [books, setBooks] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .get('/books')
      .then((res) => !cancelled && setBooks(res.data))
      .catch((err) => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <PageHeader
        icon="bi-book-fill"
        title="Books Library"
        actionTo="/books/add"
        actionIcon="bi-plus-circle"
        actionLabel="Add New Book"
      />

      {location.state?.success && <Alert type="success">{location.state.success}</Alert>}
      {error && <Alert>{error}</Alert>}

      <div className="table-container">
        <div className="table-responsive">
          {!books && !error && <Loading />}
          {books && books.length === 0 && <div className="p-3">No books found</div>}
          {books && books.length > 0 && (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>ISBN</th>
                  <th>Copies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b, i) => (
                  <tr key={b.bookId}>
                    <td>
                      <span className="badge bg-primary">{i + 1}</span>
                    </td>
                    <td>
                      <strong>{b.title}</strong>
                    </td>
                    <td>{b.author}</td>
                    <td>
                      <span className="badge badge-modern badge-fiction">{b.category}</span>
                    </td>
                    <td>
                      <code>{b.isbn}</code>
                    </td>
                    <td>
                      {b.availableCopies} / {b.totalCopies}
                    </td>
                    <td>
                      <span className="badge bg-success">{b.status}</span>
                    </td>
                    <td>
                      <Link to={`/books/${b.bookId}/edit`} className="action-btn edit" title="Edit Book">
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
