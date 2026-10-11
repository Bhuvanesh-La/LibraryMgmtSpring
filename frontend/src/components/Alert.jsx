import { useState } from 'react'

/** Dismissible Bootstrap alert, same look as the JSP success/error messages. */
export default function Alert({ type = 'danger', children, onClose }) {
  const [visible, setVisible] = useState(true)
  if (!children || !visible) return null
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {children}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={() => {
          setVisible(false)
          onClose?.()
        }}
      ></button>
    </div>
  )
}
