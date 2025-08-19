import { NextRequest, NextResponse } from 'next/server';

const url = process.env.LOKI_PUSH_URL;
const username = process.env.LOKI_USER;
const password = process.env.LOKI_PASSWORD;

function nowNs() {
  return String(Date.now() * 1_000_000);
}

export async function POST(request: NextRequest) {
  if (!url || !username || !password) {
    console.error('Missing environment variables');
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  try {
    const { level = 'info', msg = '', labels = {} } = await request.json();

    const body = {
      streams: [
        {
          stream: { app: 'pressemitteilungen', level, ...labels },
          values: [
            [nowNs(), typeof msg === 'string' ? msg : JSON.stringify(msg)],
          ],
        },
      ],
    };

    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Loki responded: ${await res.text()}`);
    }
    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Loki API error:', error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}
