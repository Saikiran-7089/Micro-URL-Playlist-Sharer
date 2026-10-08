# Architecture

## Overview
The Micro-URL Playlist Sharer follows a standard modern three-tier architecture:
1. **Frontend (Presentation Layer)**: Built with React and Vite. Handles UI rendering, user interaction, and client-side routing.
2. **Backend (Application Layer)**: Built with Node.js and Express.js. Handles business logic, API endpoints, short-code generation, and redirect logic.
3. **Database (Data Layer)**: Supabase (PostgreSQL). Stores persistent data, manages relationships, and ensures data integrity.

## Request Flow
1. **Shorten URL**: User submits a URL → Frontend calls `POST /api/urls` → Backend validates, generates a unique code via `nanoid`, and inserts into Supabase → Backend returns the short code → Frontend displays it.
2. **Redirect**: User visits `http://short.url/XYZ` → Backend intercepts `GET /XYZ` → Queries Supabase for `XYZ` → Increments the click counter → Issues an HTTP 302 Redirect to the original URL.
3. **Create Playlist**: User submits multiple URLs → Backend generates short codes for each, groups them into a playlist entity, maps them in `playlist_urls` with positional indexes → Returns playlist code.
