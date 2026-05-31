# Movie Rating API Documentation

## Overview

The Movie Rating API provides endpoints to manage movie lists, add movies, perform comparisons, and share rankings.

**Base URL**: `http://localhost:4000/api`

## Authentication

Currently, the API does not require authentication. Each list is identified by a unique ID passed as a URL parameter.

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong",
  "details": ["field1: error message", "field2: error message"] // Optional validation errors
}
```

## Endpoints

### Health Check

Check if the server is running.

```http
GET /api/health
```

**Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2026-05-31T12:00:00.000Z"
}
```

---

### Create List

Create a new movie ranking list.

```http
POST /api/lists
Content-Type: application/json

{
  "name": "My Movie Ranking"  // Optional
}
```

**Response** (201):
```json
{
  "id": "clk7z9s5a0000qz00h1x9y2k1",
  "name": "My Movie Ranking",
  "shareSlug": null,
  "createdAt": "2026-05-31T12:00:00.000Z",
  "updatedAt": "2026-05-31T12:00:00.000Z"
}
```

---

### Get Movies in List

Retrieve all movies in a list, organized by bucket with calculated scores.

```http
GET /api/lists/{listId}/movies
```

**Response** (200):
```json
{
  "listId": "clk7z9s5a0000qz00h1x9y2k1",
  "buckets": [
    {
      "bucket": "liked",
      "label": "I liked it",
      "movies": [
        {
          "id": "clk7z9tep0001qz00h1x9y2k1",
          "title": "Inception",
          "bucket": "liked",
          "position": 1,
          "status": "ranked",
          "score": 10.0
        }
      ]
    }
  ]
}
```

---

### Add Movie

Add a new movie to a list. If this is the first movie in the bucket, it's placed directly. Otherwise, you'll need to compare it with existing movies.

```http
POST /api/lists/{listId}/movies
Content-Type: application/json

{
  "title": "Inception",
  "bucket": "liked"  // Must be: "liked", "fine", or "disliked"
}
```

**Response** (201 - First movie in bucket):
```json
{
  "complete": true,
  "movie": {
    "id": "clk7z9tep0001qz00h1x9y2k1",
    "title": "Inception",
    "bucket": "liked",
    "position": 1,
    "status": "ranked"
  }
}
```

**Response** (201 - Requires comparison):
```json
{
  "complete": false,
  "movie": {
    "id": "clk7z9tep0002qz00h1x9y2k1",
    "title": "Interstellar",
    "bucket": "liked",
    "position": 0,
    "status": "pending"
  },
  "candidate": {
    "id": "clk7z9tep0001qz00h1x9y2k1",
    "title": "Inception",
    "bucket": "liked",
    "position": 1,
    "status": "ranked"
  }
}
```

**Errors**:
- `400`: Invalid bucket or missing title
- `404`: List not found

---

### Compare Movies

Compare a pending movie with a candidate movie to determine ranking position.

```http
POST /api/lists/{listId}/movies/{movieId}/compare
Content-Type: application/json

{
  "candidateMovieId": "clk7z9tep0001qz00h1x9y2k1",
  "winnerMovieId": "clk7z9tep0001qz00h1x9y2k1"  // ID of the winner
}
```

**Response** (200 - Ranking complete):
```json
{
  "complete": true,
  "movie": {
    "id": "clk7z9tep0002qz00h1x9y2k1",
    "title": "Interstellar",
    "bucket": "liked",
    "position": 1,
    "status": "ranked"
  }
}
```

**Response** (200 - More comparisons needed):
```json
{
  "complete": false,
  "movie": {
    "id": "clk7z9tep0002qz00h1x9y2k1",
    "title": "Interstellar",
    "bucket": "liked",
    "position": 0,
    "status": "pending"
  },
  "candidate": {
    "id": "clk7z9tep0003qz00h1x9y2k1",
    "title": "The Dark Knight",
    "bucket": "liked",
    "position": 2,
    "status": "ranked"
  }
}
```

**Errors**:
- `400`: Invalid request body
- `404`: Movie or candidate not found

---

### Share List

Generate a public share link for a ranking.

```http
POST /api/lists/{listId}/share
```

**Response** (201):
```json
{
  "shareSlug": "ABC123xyz"
}
```

You can share this URL: `/public/ABC123xyz`

**Errors**:
- `404`: List not found
- `500`: Failed to create share link

---

### Get Public Ranking

View a shared ranking (read-only).

```http
GET /api/public/{shareSlug}
```

**Response** (200):
```json
{
  "list": {
    "name": "My Movie Ranking",
    "updatedAt": "2026-05-31T12:00:00.000Z"
  },
  "buckets": [
    {
      "bucket": "liked",
      "label": "I liked it",
      "movies": [
        {
          "id": "clk7z9tep0001qz00h1x9y2k1",
          "title": "Inception",
          "bucket": "liked",
          "position": 1,
          "status": "ranked",
          "score": 10.0
        }
      ]
    }
  ]
}
```

**Errors**:
- `404`: Shared ranking not found

---

## Rate Limiting

Currently, there is no rate limiting. This should be added before production deployment.

## Pagination

Currently, there is no pagination. Lists are loaded entirely.

## Versioning

API version is not currently versioned. Breaking changes may occur.

---

## Examples

### Complete Flow

1. **Create a list**:
   ```bash
   curl -X POST http://localhost:4000/api/lists \
     -H "Content-Type: application/json" \
     -d '{"name": "My Top 10 Movies"}'
   ```

2. **Add first movie** (automatically ranked):
   ```bash
   curl -X POST http://localhost:4000/api/lists/{listId}/movies \
     -H "Content-Type: application/json" \
     -d '{"title": "Inception", "bucket": "liked"}'
   ```

3. **Add second movie** (requires comparison):
   ```bash
   curl -X POST http://localhost:4000/api/lists/{listId}/movies \
     -H "Content-Type: application/json" \
     -d '{"title": "Interstellar", "bucket": "liked"}'
   ```

4. **Compare movies**:
   ```bash
   curl -X POST http://localhost:4000/api/lists/{listId}/movies/{movieId}/compare \
     -H "Content-Type: application/json" \
     -d '{"candidateMovieId": "{candidateId}", "winnerMovieId": "{movieId}"}'
   ```

5. **Get ranking**:
   ```bash
   curl http://localhost:4000/api/lists/{listId}/movies
   ```

6. **Create share link**:
   ```bash
   curl -X POST http://localhost:4000/api/lists/{listId}/share
   ```

---

## Database Schema

### MovieList
- `id` (CUID) - Primary key
- `name` (String) - List name
- `shareSlug` (String) - Unique slug for public sharing
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Movie
- `id` (CUID) - Primary key
- `title` (String) - Movie title
- `bucket` (String) - Bucket category
- `position` (Int) - Position within bucket
- `status` (String) - "ranked" or "pending"
- `listId` (CUID) - Foreign key to MovieList
- `createdAt` (DateTime) - Creation timestamp

### Comparison
- `id` (CUID) - Primary key
- `listId` (CUID) - Foreign key to MovieList
- `bucket` (String) - Bucket category
- `winnerMovieId` (CUID) - Winning movie ID
- `loserMovieId` (CUID) - Losing movie ID
- `createdAt` (DateTime) - Comparison timestamp
