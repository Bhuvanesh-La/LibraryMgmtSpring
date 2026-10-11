import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BookList from './pages/BookList.jsx'
import BookForm from './pages/BookForm.jsx'
import AssignBook from './pages/AssignBook.jsx'
import ReturnBooks from './pages/ReturnBooks.jsx'
import ReturnDetails from './pages/ReturnDetails.jsx'
import UserList from './pages/UserList.jsx'
import UserForm from './pages/UserForm.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/add" element={<BookForm />} />
          <Route path="/books/:id/edit" element={<BookForm />} />
          <Route path="/assign" element={<AssignBook />} />
          <Route path="/returns" element={<ReturnBooks />} />
          <Route path="/returns/:id" element={<ReturnDetails />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/add" element={<UserForm />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
