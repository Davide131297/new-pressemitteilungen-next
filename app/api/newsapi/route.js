import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/database';

async function saveToDatabase(collectionName, data) {
  try {
    const client = await getDbClient();
    const database = client.db('Pressemitteilungen');
    let dbCollection;

    if (collectionName === 'newsapi') {
      dbCollection = database.collection('News.API');
      if (data.articles && data.articles.length > 0) {
        const seenTitles = new Set();
        const filteredData = data.articles.filter((item) => {
          const isValidSource = item.title.startsWith('Kalenderblatt'); // Nicht relevant
          const isUniqueTitle = !seenTitles.has(item.title);
          if (isValidSource && isUniqueTitle) {
            seenTitles.add(item.title);
            return true;
          }
          return false;
        });

        if (filteredData.length > 0) {
          const result = await dbCollection.insertMany(filteredData);
          console.log(`${result.insertedCount} Dokumente wurden eingefügt`);
        } else {
          console.log('Keine Artikel zum Einfügen');
        }
      } else {
        console.log('Keine Artikel zum Einfügen');
      }
    }
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
}

async function fetchNewsApi(apiKey, startDate, endDate) {
  const apiUrl = `https://newsapi.org/v2/everything?domains=tagesspiegel.de,zeit.de,handelsblatt.com,spiegel.de&apiKey=${apiKey}&from=${startDate}&to=${endDate}&sortBy=publishedAt`;
  console.log('API-URL:', apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  await saveToDatabase('newsapi', data);
}

async function fetchData(apiKey, startDate, endDate) {
  await Promise.all([fetchNewsApi(apiKey, startDate, endDate)]);
}

export async function GET() {
  const startDate = new Date();
  const endDate = new Date();
  const apiKey = process.env.NEWS_API_KEY;

  console.log('ApiKey:', apiKey);

  const formattedStartDate = `${startDate.getFullYear()}-${String(
    startDate.getDate()
  ).padStart(2, '0')}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
  const formattedEndDate = `${endDate.getFullYear()}-${String(
    endDate.getDate()
  ).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'NEWS_API_KEY ist nicht definiert' },
      { status: 500 }
    );
  }

  try {
    await fetchData(apiKey, formattedStartDate, formattedEndDate);
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
