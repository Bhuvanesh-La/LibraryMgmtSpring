import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api, errorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import IssuedTable from '../components/IssuedTable.jsx'
import Loading from '../components/Loading.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function ReturnBooks() {
  const location = useLocation()
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .get('/issues')
      .then((res) => !cancelled && setItems(res.data))
      .catch((err) => !cancelled && setError(errorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <PageHeader
        icon="bi-arrow-left-circle"
        title="Return Issued Books"
        subtitle="Monitor borrowed books and record their safe return."
      />

      {location.state?.success && <Alert type="success">{location.state.success}</Alert>}
      {error && <Alert>{error}</Alert>}

      <div className="table-container">
        <div className="table-responsive">
          {!items && !error && <Loading />}
          {items && <IssuedTable items={items} />}
        </div>
      </div>
    </>
  )
}
