import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/database';

async function saveToDatabase(collectionName, data) {
  try {
    const client = await getDbClient();
    const database = client.db('Pressemitteilungen');
    let dbCollection;

    if (collectionName === 'newsdata') {
      dbCollection = database.collection('News.DATA');
      if (data.results && data.results.length > 0) {
        const result = await dbCollection.insertMany(data.results);
        console.log(`${result.insertedCount} Dokumente wurden eingefügt`);
      } else {
        console.log('Keine Ergebnisse zum Einfügen');
      }
    } else {
      throw new Error('Ungültige Sammlung');
    }
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
}

async function fetchNewsData() {
  const apiUrl = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_DATA_KEY}&language=de&country=de&category=politics`;
  console.log('API-URL:', apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  await saveToDatabase('newsdata', data);
}

async function fetchData() {
  await Promise.all([fetchNewsData()]);
}

export async function GET() {
  try {
    await fetchData();
    return NextResponse.json(
      { message: 'Daten erfolgreich abgerufen und gespeichert' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Abrufen und Speichern der Daten:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen und Speichern der Daten' },
      { status: 500 }
    );
  }
}
