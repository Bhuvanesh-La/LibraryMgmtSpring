# Library Management System — Spring Boot + React

Conversion of the original **JSP / Servlet / JDBC** project into:

- `backend/`  — Spring Boot 3 REST API (Java 17, Spring Data JPA, Spring Security + JWT, MySQL)
- `frontend/` — React 18 SPA (Vite, React Router, Axios, Bootstrap 5) — original look & CSS kept

## Run it

**Prerequisites:** Java 17+, Maven, Node 18+, MySQL running locally.

```bash
# 1. Backend  (http://localhost:8080)
cd backend
export DB_PASSWORD=your_mysql_password      # DB_USERNAME defaults to root
mvn spring-boot:run

# 2. Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and sign in with the default admin
(created automatically if the `users` table has no ADMIN):

| username | password |
|---|---|
| `admin@library.com` | `admin123` |

Change these via `ADMIN_EMAIL` / `ADMIN_PASSWORD` **before first start**, and set a real `JWT_SECRET`
(32+ chars) for anything other than local development.

Configuration lives in `backend/src/main/resources/application.properties`
(every value can be overridden with an environment variable).

### Using your existing `library_db`
Point the backend at it (same database name, same table/column names). Existing plain-text passwords
still work: they are converted to BCrypt hashes automatically on that user's first successful login.


## REST API

All endpoints except login require `Authorization: Bearer <token>`.

| Method | Path | Replaces |
|---|---|---|
| POST | `/api/auth/login` | `AuthenticationController?action=checkLogin` |
| GET | `/api/dashboard` | `DashboardController?action=viewDashboard` |
| GET | `/api/books` | `allBookList` |
| GET | `/api/books/available` | books half of `showAssignBook` |
| GET | `/api/books/{id}` | `viewBook` |
| POST | `/api/books` | `addbook` |
| PUT | `/api/books/{id}` | `updateBook` |
| GET | `/api/users` | `allUserList` |
| GET | `/api/users/{id}` | `viewUser` |
| POST | `/api/users` | `addUser` |
| PUT | `/api/users/{id}` | `updateUser` |
| GET | `/api/issues` | `showReturnBook` (currently issued books) |
| GET | `/api/issues/{id}` | `showReturnBookDetails` |
| POST | `/api/issues` | `assignBook` |
| POST | `/api/issues/{id}/return` | `returnBook` |

8. The **Delete buttons** (books/users) were non-functional placeholders in the original; they are omitted
   rather than ported as dead buttons.
9. Dates are stored as `DATE` and shown as `dd-MM-yyyy`.

Left as in the original: returning a book always puts a copy back in stock, even when the condition is
"Lost" or "Damaged" — you may want to change that in `IssueService.returnBook`.
