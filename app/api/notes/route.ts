import { env } from 'cloudflare:workers';
import { tripNoteImagesIndex, tripNoteImagesSchema, tripNotesIndex, tripNotesSchema } from '../../../db/schema';

type NoteRow = {
  id: number;
  place_key: string;
  author: string;
  body: string;
  created_at: string;
  image_key: string | null;
};

async function ensureSchema() {
  await env.DB.batch([
    env.DB.prepare(tripNotesSchema),
    env.DB.prepare(tripNotesIndex),
    env.DB.prepare(tripNoteImagesSchema),
    env.DB.prepare(tripNoteImagesIndex),
  ]);
}

export async function GET() {
  await ensureSchema();
  const { results } = await env.DB.prepare(
    `SELECT trip_notes.id, trip_notes.place_key, trip_notes.author, trip_notes.body, trip_notes.created_at,
      trip_note_images.object_key AS image_key
     FROM trip_notes LEFT JOIN trip_note_images ON trip_note_images.note_id = trip_notes.id
     ORDER BY trip_notes.created_at DESC LIMIT 300`,
  ).all<NoteRow>();
  return Response.json({ notes: results });
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const placeKey = typeof form?.get('placeKey') === 'string' ? String(form?.get('placeKey')).trim() : '';
  const author = typeof form?.get('author') === 'string' ? String(form?.get('author')).trim().slice(0, 32) : '';
  const body = typeof form?.get('body') === 'string' ? String(form?.get('body')).trim().slice(0, 600) : '';
  const image = form?.get('image');

  if (!placeKey || !author || !body) return Response.json({ error: 'Add your name and a short note.' }, { status: 400 });
  if (image instanceof File && image.size > 8 * 1024 * 1024) return Response.json({ error: 'Please choose an image under 8 MB.' }, { status: 400 });
  if (image instanceof File && !['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(image.type)) return Response.json({ error: 'Use a JPEG, PNG, WebP, HEIC, or HEIF image.' }, { status: 400 });

  await ensureSchema();
  const insert = await env.DB.prepare('INSERT INTO trip_notes (place_key, author, body) VALUES (?, ?, ?)').bind(placeKey, author, body).run();
  const noteId = Number(insert.meta.last_row_id);
  let imageKey: string | null = null;
  if (image instanceof File && image.size > 0) {
    imageKey = `trip-notes/${crypto.randomUUID()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    await env.IMAGES.put(imageKey, image.stream(), { httpMetadata: { contentType: image.type } });
    await env.DB.prepare('INSERT INTO trip_note_images (note_id, object_key, content_type) VALUES (?, ?, ?)').bind(noteId, imageKey, image.type).run();
  }
  const note = await env.DB.prepare(
    `SELECT trip_notes.id, trip_notes.place_key, trip_notes.author, trip_notes.body, trip_notes.created_at,
      trip_note_images.object_key AS image_key
     FROM trip_notes LEFT JOIN trip_note_images ON trip_note_images.note_id = trip_notes.id
     WHERE trip_notes.id = ?`,
  ).bind(noteId).first<NoteRow>();
  return Response.json({ note }, { status: 201 });
}
