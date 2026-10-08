# Micro-URL Playlist Sharer

## Overview

Micro-URL Playlist Sharer is a complete, production-quality web application designed to simplify link management. It provides an intuitive interface for users to shorten long, unwieldy URLs into concise, shareable links, and group multiple links together into centralized playlists.

The application boasts a robust backend that handles redirect logic, click tracking, and dataset management securely. It utilizes Supabase for persistent, highly scalable PostgreSQL storage, ensuring high availability and seamless data management. 

## Features

- URL shortening
- Unique short-code generation
- URL redirection
- Click tracking
- Click statistics
- Playlist creation
- Multiple URLs per playlist
- Playlist ordering
- Copy short URL
- Supabase persistence
- REST API
- React frontend

## Technology Stack

Frontend:
- React
- Vite
- Axios
- CSS (Tailwind CSS)

Backend:
- Node.js
- Express.js
- nanoid

Database:
- Supabase
- PostgreSQL

Development:
- Git
- GitHub
- Postman

## Architecture

The system operates on a distinct client-server architecture with seamless database integrations:

React Frontend
      ↓
Express REST API
      ↓
Supabase
      ↓
PostgreSQL

**Redirect Flow:** When a user visits a shortened URL, the request hits the Express REST API. The backend queries Supabase to find the original URL and increments the click counter asynchronously. Finally, it responds with an HTTP 302 redirect to the original destination, smoothly routing the user.

## Database Schema

The database consists of three core tables to manage URLs and Playlists securely.

- `urls`: Stores the core data for shortened URLs. Fields include `id`, `original_url`, `short_code`, `clicks`, and `created_at`.
- `playlists`: Stores metadata for grouped collections. Fields include `id`, `name`, `playlist_code`, and `created_at`.
- `playlist_urls`: A junction table that enables a many-to-many relationship between playlists and URLs. It uses foreign keys (`playlist_id` and `url_id`) and includes a `position` field to reliably preserve the order of links within a playlist.

## API Documentation

### Health Check
- **Method**: GET
- **Endpoint**: `/api/health`
- **Purpose**: Verify that the API and database are configured correctly.
- **Response**: JSON status object.
- **Status codes**: 200 OK

### Create Short URL
- **Method**: POST
- **Endpoint**: `/api/urls`
- **Purpose**: Shortens a given URL.
- **Request body**: `{ "originalUrl": "https://example.com" }`
- **Response**: JSON object with `shortCode` and `shortUrl`.
- **Status codes**: 201 Created, 400 Bad Request (Invalid URL), 500 Internal Server Error

### Get URL Statistics
- **Method**: GET
- **Endpoint**: `/api/urls/:shortCode/stats`
- **Purpose**: Retrieves click metrics and metadata for a given short code.
- **Response**: JSON object with clicks and timestamps.
- **Status codes**: 200 OK, 404 Not Found

### Redirect Short URL
- **Method**: GET
- **Endpoint**: `/:shortCode`
- **Purpose**: Resolves the short code to the original URL and redirects the user, while incrementing the click counter.
- **Response**: HTTP 302 Found (Redirect)
- **Status codes**: 302 Found, 404 Not Found

### Create Playlist
- **Method**: POST
- **Endpoint**: `/api/playlists`
- **Purpose**: Groups multiple URLs into a new playlist, shortening any URLs as needed.
- **Request body**: `{ "name": "My Links", "urls": ["https://example.com"] }`
- **Response**: JSON object containing the `playlistCode`.
- **Status codes**: 201 Created, 400 Bad Request

### Get Playlist
- **Method**: GET
- **Endpoint**: `/api/playlists/:playlistCode`
- **Purpose**: Retrieves all links for a playlist in their intended order.
- **Response**: JSON object with playlist details and ordered links.
- **Status codes**: 200 OK, 404 Not Found

## Environment Variables

The application relies on environment variables for configuration. Secret keys must never be committed to source control.

**Backend (`server/.env`):**
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Local Development

Follow these steps to run the project locally:

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd micro-url-playlist-sharer
   ```
2. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` in both `server/` and `client/` directories and fill in your Supabase project URL and service role key.
4. Run backend:
   ```bash
   cd server
   npm run dev
   ```
5. Run frontend:
   ```bash
   cd client
   npm run dev
   ```
6. Open application:
   Visit `http://localhost:5173` in your browser.

## Testing

The following end-to-end tests have been verified:
- **Health check**: Confirms Supabase API connection and credentials presence.
- **Create short URL**: Rejects invalid links and properly provisions 6-character codes.
- **Redirect**: Resolves code and issues 302 redirect.
- **Click tracking**: Increments exactly once per successful 302 dispatch.
- **Statistics**: Accurately reports up-to-date click numbers.
- **Create playlist**: Generates atomic short links for each array entry and establishes ordered relationships.
- **Retrieve playlist**: Accurately retains order tracking.
- **Invalid input**: Returns 400 Bad Request.
- **404 handling**: Handles non-existent codes securely without exposing stack traces.
- **Production build**: Frontend compiles without issues.

## Deployment

### Supabase (Database)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and execute the schema from `database/schema.sql`.

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com).
2. Use the provided `render.yaml` configuration or set the Build Command to `npm install` and Start Command to `npm start`.
3. Provide the environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`, `BASE_URL`).

### Frontend (Vercel)
1. Import the project into [Vercel](https://vercel.com).
2. Set the Root Directory to `client`.
3. Add the `VITE_API_BASE_URL` environment variable pointing to your deployed Render backend.

## Security

- **Environment variables**: Sensitive settings are kept in `.env` files that are ignored by Git.
- **Service-role key protection**: The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and is restricted entirely to the Node.js backend. It is never exposed in API responses or the React bundle.
- **CORS**: Cross-Origin Resource Sharing is strictly configured to only allow requests from the designated `FRONTEND_URL`.
- **Input validation**: The backend enforces strict URL parsing and array validation to prevent malformed injections.
- **Database constraints**: Uniqueness and referential integrity (ON DELETE CASCADE) are enforced at the PostgreSQL level.
- **No hardcoded secrets**: All keys are provided dynamically via the environment.

## Project Structure

```
micro-url-playlist-sharer/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── database/
│   └── schema.sql
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── render.yaml
│   └── server.js
├── .gitignore
└── README.md
```

## Future Enhancements

- User authentication
- Custom aliases
- QR codes
- Advanced analytics
- Playlist editing
- Expiration dates
- Rate limiting
- Custom domains
