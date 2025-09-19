import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const PROJECT_URL = process.env.PROJECT_URL;

  await fetch(`${PROJECT_URL}/api/database`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.DELETE_TOKEN}`,
    },
  });

  return Response.json({ ok: true });
}
