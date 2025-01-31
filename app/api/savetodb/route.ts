import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '../../../lib/database';

export async function POST(req: NextRequest) {
  const { collectionName, data } = await req.json();
  try {
    const client = await getDbClient();
    const database = client.db('Pressemitteilungen');
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(data);
    console.log('Daten erfolgreich gespeichert:', result);
    return NextResponse.json(
      { message: 'Daten erfolgreich gespeichert', result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Keine Datenbank-Verbindung vorhanden', error);
    return NextResponse.json(
      { message: 'Fehler beim Speichern der Daten', error },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}
