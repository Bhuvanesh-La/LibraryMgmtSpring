import { Link } from 'react-router-dom'

export default function PageHeader({ icon, title, subtitle, actionTo, actionIcon, actionLabel }) {
  const withButton = !!actionTo
  return (
    <div className={`page-header ${withButton ? 'header-with-btn' : ''}`}>
      <div>
        <h1 className="h2">
          <i className={`bi ${icon} me-2`}></i>
          {title}
        </h1>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {withButton && (
        <Link to={actionTo} className="btn-modern">
          <i className={`bi ${actionIcon}`}></i>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
