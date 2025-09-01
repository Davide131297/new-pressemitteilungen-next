import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://rss.dawum.de');
  const xml = await res.text();
  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
