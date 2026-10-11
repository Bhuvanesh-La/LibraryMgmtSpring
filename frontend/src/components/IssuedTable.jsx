import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format.js'

const BADGE = { Overdue: 'bg-danger', 'Due Today': 'bg-warning', Active: 'bg-success' }

/** Shared by Dashboard ("Currently Issued Books") and the Return Book page. */
export default function IssuedTable({ items }) {
  if (!items || items.length === 0) return <div>No books issued</div>

  return (
    <table className="table table-hover align-middle">
      <thead>
        <tr>
          <th>#</th>
          <th>Book</th>
          <th>Member</th>
          <th>Issued On</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it, i) => (
          <tr key={it.issueId}>
            <td>
              <span className="badge bg-primary">{i + 1}</span>
            </td>
            <td>
              <strong>{it.title}</strong>
              <div className="text-muted small">
                ISBN: <code>{it.isbn}</code>
              </div>
            </td>
            <td>
              <div>
                {it.firstName} {it.lastName}
              </div>
              <div className="text-muted small">{it.email}</div>
            </td>
            <td>{formatDate(it.issueDate)}</td>
            <td>{formatDate(it.dueDate)}</td>
            <td>
              <span className={`badge ${BADGE[it.dueDayStatus] || 'bg-success'} text-dark`}>{it.dueDayStatus}</span>
            </td>
            <td>
              <Link to={`/returns/${it.issueId}`} className="btn btn-sm btn-outline-primary">
                <i className="bi bi-arrow-return-left me-1"></i>Return
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
