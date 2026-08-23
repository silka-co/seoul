export const tripNotesSchema = `
  CREATE TABLE IF NOT EXISTS trip_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_key TEXT NOT NULL,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const tripNotesIndex = `
  CREATE INDEX IF NOT EXISTS idx_trip_notes_place_created
  ON trip_notes(place_key, created_at DESC)
`;

export const tripNoteImagesSchema = `
  CREATE TABLE IF NOT EXISTS trip_note_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id INTEGER NOT NULL,
    object_key TEXT NOT NULL UNIQUE,
    content_type TEXT NOT NULL,
    FOREIGN KEY (note_id) REFERENCES trip_notes(id)
  )
`;

export const tripNoteImagesIndex = `
  CREATE INDEX IF NOT EXISTS idx_trip_note_images_note
  ON trip_note_images(note_id)
`;
