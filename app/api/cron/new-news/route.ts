import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const PROJECT_URL = process.env.PROJECT_URL;

  await Promise.all([
    fetch(`${PROJECT_URL}/api/newsdata`),
    fetch(`${PROJECT_URL}/api/newsmediastack`),
  ]);

  return Response.json({ ok: true });
}
