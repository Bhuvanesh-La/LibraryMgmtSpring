import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import IssuedTable from '../components/IssuedTable.jsx'
import Loading from '../components/Loading.jsx'
import PageHeader from '../components/PageHeader.jsx'

const CARDS = [
  { key: 'totalBooks', title: 'Total Books', icon: 'bi-book-fill', tone: 'primary' },
  { key: 'booksAssigned', title: 'Books Assigned', icon: 'bi-arrow-right-circle-fill', tone: 'warning' },
  { key: 'booksReturned', title: 'Books Returned', icon: 'bi-arrow-left-circle-fill', tone: 'success' },
  { key: 'totalUsers', title: 'Users', icon: 'bi-people-fill', tone: 'info' },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .get('/dashboard')
      .then((res) => !cancelled && setData(res.data))
      .catch((err) => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <PageHeader icon="bi-speedometer2" title="Dashboard" />
      {error && <Alert>{error}</Alert>}
      {!data && !error && <Loading />}

      {data && (
        <>
          <div className="row mb-4">
            {CARDS.map((c) => (
              <div className="col-md-3" key={c.key}>
                <div className={`card text-white stat-card ${c.tone} mb-3`}>
                  <div className="card-body">
                    <i className={`bi ${c.icon} stat-icon`}></i>
                    <h5 className="card-title">{c.title}</h5>
                    <p className="card-text">{data[c.key] ?? 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h4 className="section-title">Currently Issued Books</h4>
          <div className="table-container">
            <div className="table-responsive">
              <IssuedTable items={data.issuedBooks} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
