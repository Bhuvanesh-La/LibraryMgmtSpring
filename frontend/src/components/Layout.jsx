import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const NAV = [
  { to: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard', match: (p) => p === '/dashboard' },
  { to: '/assign', icon: 'bi-arrow-right-circle', label: 'Assign Book', match: (p) => p === '/assign' },
  { to: '/returns', icon: 'bi-arrow-left-circle', label: 'Return Book', match: (p) => p.startsWith('/returns') },
  { to: '/books', icon: 'bi-book', label: 'Books', match: (p) => p === '/books' || /^\/books\/\d+/.test(p) },
  { to: '/books/add', icon: 'bi-plus-circle', label: 'Add Book', match: (p) => p === '/books/add' },
  { to: '/users', icon: 'bi-people', label: 'Users', match: (p) => p === '/users' || /^\/users\/\d+/.test(p) },
  { to: '/users/add', icon: 'bi-person-plus', label: 'Add User', match: (p) => p === '/users/add' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function signOut() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="navbar navbar-dark sticky-top flex-md-nowrap p-0 shadow">
        <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3" to="/dashboard">
          <i className="bi bi-book-half me-2"></i>Library
        </Link>
        <button
          className={`navbar-toggler position-absolute d-md-none ${menuOpen ? '' : 'collapsed'}`}
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-nav d-flex flex-row align-items-center me-3">
          <span className="text-white me-3">
            Welcome, {user?.firstName} {user?.lastName}
          </span>
          <div className="nav-item text-nowrap">
            <button className="nav-link px-3 btn btn-link" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav id="sidebarMenu" className={`col-md-3 col-lg-2 d-md-block sidebar collapse ${menuOpen ? 'show' : ''}`}>
            <div className="position-sticky sidebar-sticky">
              <ul className="nav flex-column">
                {NAV.map((item) => (
                  <li className="nav-item" key={item.to}>
                    <Link
                      className={`nav-link ${item.match(pathname) ? 'active' : ''}`}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                    >
                      <i className={`bi ${item.icon}`}></i>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
