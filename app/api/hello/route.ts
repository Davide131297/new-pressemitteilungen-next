import { NextResponse } from 'next/server';

export function GET() {
  console.log('Hello Test');
  return NextResponse.json({ message: 'Hello Test' }, { status: 200 });
}
