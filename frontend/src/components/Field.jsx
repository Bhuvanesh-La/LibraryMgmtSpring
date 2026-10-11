/** Bootstrap floating-label field with an inline validation message. */
export default function Field({ id, label, icon, error, as = 'input', children, className = '', ...props }) {
  const Tag = as
  const cls = as === 'select' ? 'form-select' : 'form-control'
  return (
    <div className="form-floating">
      <Tag id={id} name={id} className={`${cls} ${className}`} placeholder={label} {...props}>
        {children}
      </Tag>
      <label htmlFor={id}>
        {icon && <i className={`bi ${icon} me-2`}></i>}
        {label}
      </label>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  )
}
