CREATE TABLE IF NOT EXISTS trip_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place_key TEXT NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trip_notes_place_created
ON trip_notes(place_key, created_at DESC);
