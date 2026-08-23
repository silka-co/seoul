import { env } from 'cloudflare:workers';
import { tripNotesIndex, tripNotesSchema } from '../../../db/schema';

type NoteRow = {
  id: number;
  place_key: string;
  author: string;
  body: string;
  created_at: string;
};

async function ensureSchema() {
  await env.DB.batch([
    env.DB.prepare(tripNotesSchema),
    env.DB.prepare(tripNotesIndex),
  ]);
}

export async function GET() {
  await ensureSchema();
  const { results } = await env.DB.prepare(
    'SELECT id, place_key, author, body, created_at FROM trip_notes ORDER BY created_at DESC LIMIT 300',
  ).all<NoteRow>();
  return Response.json({ notes: results });
}

export async function POST(request: Request) {
  const input = await request.json().catch(() => null) as { placeKey?: unknown; author?: unknown; body?: unknown } | null;
  const placeKey = typeof input?.placeKey === 'string' ? input.placeKey.trim() : '';
  const author = typeof input?.author === 'string' ? input.author.trim().slice(0, 32) : '';
  const body = typeof input?.body === 'string' ? input.body.trim().slice(0, 600) : '';

  if (!placeKey || !author || !body) {
    return Response.json({ error: 'Add your name and a short note.' }, { status: 400 });
  }

  await ensureSchema();
  const result = await env.DB.prepare(
    'INSERT INTO trip_notes (place_key, author, body) VALUES (?, ?, ?)',
  ).bind(placeKey, author, body).run();
  const note = await env.DB.prepare(
    'SELECT id, place_key, author, body, created_at FROM trip_notes WHERE id = ?',
  ).bind(result.meta.last_row_id).first<NoteRow>();
  return Response.json({ note }, { status: 201 });
}
