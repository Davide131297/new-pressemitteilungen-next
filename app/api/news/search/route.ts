import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const apiKey = process.env.NEWS_API_KEY;
  const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query || ''
  )}&language=de&sortBy=relevancy&apiKey=${apiKey}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.status === 'ok') {
    return NextResponse.json({ response: data }, { status: 200 });
  } else {
    return NextResponse.json({ error: data }, { status: 500 });
  }
}
