# Iron Events API

REST API for the Iron Events 2026 project, built with Express 5 and MongoDB.

## Tech stack

| Layer | Technology |
|---|---|
| HTTP server | Express 5 |
| Database | MongoDB + Mongoose |
| Password hashing | bcryptjs |
| Logging | pino + pino-http |
| Configuration | convict |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your values
cp .env.template .env

# 3. Start the server
npm start
```

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default: `3000`) |
| `MONGODB_URI` | MongoDB connection string |

## API

Base path: `/api/v0`

### Users

| Method | Path | Auth required | Description |
|---|---|---|---|
| `POST` | `/users` | No | Register a new user |
| `POST` | `/sessions` | No | Log in — sets the session cookie |

**Register** `POST /api/v0/users`

```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Login** `POST /api/v0/sessions`

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

On success the server sets a `sessionid` cookie (24 h TTL, `HttpOnly`, `SameSite=Strict`). The browser sends it automatically on every subsequent request.

### Events

All event endpoints require a valid session cookie.

| Method | Path | Description |
|---|---|---|
| `GET` | `/events` | List all events |
| `POST` | `/events` | Create an event |
| `GET` | `/events/:id` | Get event by ID |
| `PATCH` | `/events/:id` | Update an event |
| `DELETE` | `/events/:id` | Delete an event |

### Auth flow

```
Client                          Server
  |                               |
  |-- POST /sessions -----------> |
  |                               | 1. Verify email + password
  |                               | 2. Create Session document (24 h TTL)
  |<-- Set-Cookie: sessionid=... -|
  |                               |
  |-- GET /events (+ cookie) ---> |
  |                               | 3. auth middleware reads cookie
  |                               | 4. Finds Session in MongoDB
  |                               | 5. Attaches req.user
  |<-- 200 events[] ------------- |
```

## Project structure

```
src/
├── app.js                    # Express bootstrap, middleware stack
├── controllers/
│   ├── index.js              # Router — all route definitions
│   ├── events.controller.js  # CRUD handlers for events
│   └── users.controller.js   # Register + login handlers
├── middlewares/
│   ├── auth.mid.js           # Session cookie validation
│   ├── errors.mid.js         # 404 + global error handler
│   └── index.js
└── lib/
    ├── config.js             # Convict config schema
    ├── db.js                 # Mongoose connection
    ├── logger.js             # Pino logger instance
    └── models/
        ├── event.model.js
        ├── session.model.js  # TTL index auto-deletes expired sessions
        └── user.model.js     # Pre-save hook hashes the password
```
