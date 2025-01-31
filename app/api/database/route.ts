import { MongoClient } from 'mongodb';
import { deleteToken } from '../../../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

let dbClient: MongoClient | null = null;

async function getDbClient() {
  if (!dbClient) {
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.4k82o.mongodb.net/?retryWrites=true&w=majority`;
    console.log('Datenbank-URI:', uri);
    try {
      dbClient = new MongoClient(uri);
      await dbClient.connect();
      console.log('Datenbank-Verbindung hergestellt');
    } catch (error) {
      console.error('Fehler beim Herstellen der Datenbank-Verbindung:', error);
      throw new Error('Datenbank-Verbindung fehlgeschlagen');
    }
  }
  return dbClient;
}

export async function DELETE(req: NextRequest) {
  if (req.method !== 'DELETE') {
    return NextResponse.json(
      { message: 'Method not allowed' },
      { status: 405 }
    );
  }

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token || !deleteToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await getDbClient();
    const db = client.db('Pressemitteilungen');
    await db.dropDatabase();
    return NextResponse.json(
      { message: 'Datenbank erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Löschen der Datenbank:', error);
    return NextResponse.json(
      { message: 'Fehler beim Löschen der Datenbank' },
      { status: 500 }
    );
  }
}
