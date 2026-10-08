# Testing Report

| Test Case | Input | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| Health Check | `GET /api/health` | 200 OK, JSON status | 200 OK | PASS |
| Create Short URL | `{ "originalUrl": "https://google.com" }` | 201 Created, returns shortCode | 201 Created | PASS |
| Invalid URL Creation | `{ "originalUrl": "not-a-url" }` | 400 Bad Request | 400 Bad Request | PASS |
| Redirect | `GET /:shortCode` | 302 Found, redirects to original | 302 Found | PASS |
| Missing Short Code | `GET /invalidCode` | 404 Not Found | 404 Not Found | PASS |
| Click Tracking | Visit short URL | Clicks increment by 1 | Increments accurately | PASS |
| Statistics | `GET /api/urls/:shortCode/stats` | Returns click metrics | Accurately returns data | PASS |
| Create Playlist | Array of 2 URLs | 201 Created, returns playlistCode | 201 Created | PASS |
| Retrieve Playlist | `GET /api/playlists/:playlistCode` | Returns 2 URLs in original order | Correct ordered URLs | PASS |
| Production Build | `npm run build` | Zero compile errors, dist generated | Zero errors | PASS |
