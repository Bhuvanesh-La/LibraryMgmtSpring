import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ maxWidth: 480, margin: '10vh auto', padding: '0 1.5rem' }}>
      <div className="card text-center shadow-sm" style={{ padding: '2.5rem 2rem', borderRadius: 12 }}>
        <div style={{ fontSize: '3rem', fontWeight: 700, color: '#dc3545' }}>404</div>
        <h1 className="h4">Page Not Found</h1>
        <p className="text-muted mb-4">
          We can't find the page you're looking for. It may have moved or no longer exists.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
