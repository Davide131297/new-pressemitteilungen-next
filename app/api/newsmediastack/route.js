import { getDbClient } from '../../../lib/database';
import { NextResponse } from 'next/server';

const ALLOWED_SOURCES = new Set([
  'pnn',
  'der tagesspiegel',
  'stern',
  'merkur-online',
  'die welt',
  'hna',
  'tagesschau',
  'faz',
  'swr',
  'n-tv',
  'ndr',
  'radioduisburg',
  'neue zuercher zeitung',
  'focus',
  'hr-online',
  'mdr',
  'heute',
  'sueddeutsche',
  't-online',
  'zeit',
  'radiokoeln',
  'az-web',
  'kicker.de',
  'der spiegel',
]);

const normalizeSource = (source) => source?.toLowerCase().trim();

async function saveToDatabase(collectionName, data) {
  try {
    const client = await getDbClient();
    const database = client.db('Pressemitteilungen');
    let dbCollection;

    if (collectionName === 'newsmediastack') {
      dbCollection = database.collection('News.Mediastack');

      if (data.data && data.data.length > 0) {
        const seenTitles = new Set();
        const filteredData = data.data.filter((item) => {
          const source = normalizeSource(item.source);
          const isAllowedSource = ALLOWED_SOURCES.has(source);
          const isUniqueTitle = !seenTitles.has(item.title);
          const hasImage = item.image !== null; // 🚀 Neue Bedingung

          if (isAllowedSource && isUniqueTitle && hasImage) {
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

async function fetchNewsMediaStack(apiKey, keywords) {
  const apiUrl = `http://api.mediastack.com/v1/news?access_key=${apiKey}&languages=de&keywords=${keywords}&limit=100`;
  console.log('API-URL:', apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  await saveToDatabase('newsmediastack', data);
}

async function fetchData(apiKey, keywords) {
  await Promise.all([fetchNewsMediaStack(apiKey, keywords)]);
}

export async function GET() {
  const apiKey = process.env.NEWS_MEDIASTACK_KEY;
  //const keywords = 'spd,cdu,csu,grünen,linke,fdp,bsw,afd'; // Nur vor Wahlen relevant
  const keywords = '';

  console.log('ApiKey:', apiKey);

  if (!apiKey) {
    return NextResponse.json(
      { error: 'NEWS_MEDIASTACK_KEY ist nicht definiert' },
      { status: 500 }
    );
  }

  try {
    await fetchData(apiKey, keywords);
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
