# Database Schema

The database consists of three main tables stored in PostgreSQL (Supabase).

## `urls` Table
Stores the individual short links.
- `id`: UUID, Primary Key.
- `original_url`: TEXT, Not Null.
- `short_code`: VARCHAR, Not Null, Unique.
- `clicks`: INTEGER, Default 0.
- `created_at`: TIMESTAMP WITH TIME ZONE.

## `playlists` Table
Stores playlist metadata.
- `id`: UUID, Primary Key.
- `name`: VARCHAR, Not Null.
- `playlist_code`: VARCHAR, Not Null, Unique.
- `created_at`: TIMESTAMP WITH TIME ZONE.

## `playlist_urls` Table
Junction table mapping URLs to playlists while preserving order.
- `id`: UUID, Primary Key.
- `playlist_id`: UUID, Foreign Key (`playlists.id`), ON DELETE CASCADE.
- `url_id`: UUID, Foreign Key (`urls.id`), ON DELETE CASCADE.
- `position`: INTEGER, Not Null (Used for ordering).
- `created_at`: TIMESTAMP WITH TIME ZONE.

## Relationships
A `Playlist` has a many-to-many relationship with `Urls` through `playlist_urls`. The `ON DELETE CASCADE` constraint ensures that deleting a playlist automatically removes its associated junction records without leaving orphaned relationships.
