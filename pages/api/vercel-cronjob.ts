import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db, Collection } from 'mongodb';

let dbClient: MongoClient | null = null;

async function getDbClient(): Promise<MongoClient> {
  if (!dbClient) {
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.4k82o.mongodb.net/?retryWrites=true&w=majority`;
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

async function saveToDatabase(
  collectionName: string,
  data: any
): Promise<void> {
  try {
    const client = await getDbClient();
    const database: Db = client.db('Pressemitteilungen');
    let dbCollection: Collection;

    if (collectionName === 'newsapi') {
      dbCollection = database.collection('News.API');
      if (data.articles && data.articles.length > 0) {
        const result = await dbCollection.insertMany(data.articles);
        console.log(`${result.insertedCount} Dokumente wurden eingefügt`);
      } else {
        console.log('Keine Artikel zum Einfügen');
      }
    } else if (collectionName === 'newsdata') {
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

async function fetchNewsApi(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<void> {
  const apiUrl = `https://newsapi.org/v2/everything?domains=tagesspiegel.de,zeit.de,handelsblatt.com,spiegel.de&apiKey=${apiKey}&from=${startDate}&to=${endDate}&sortBy=publishedAt`;
  console.log('API-URL:', apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  await saveToDatabase('newsapi', data);
}

async function fetchNewsData(): Promise<void> {
  const apiUrl = `https://newsdata.io/api/1/latest?apikey=pub_6098201d1e4ef7697cc5510571b9bf77223cc&language=de&country=de&category=politics`;
  console.log('API-URL:', apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  await saveToDatabase('newsdata', data);
}

async function fetchData(
  apiKey: string,
  startDate: string,
  endDate: string
): Promise<void> {
  await Promise.all([
    fetchNewsApi(apiKey, startDate, endDate),
    fetchNewsData(),
  ]);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const startDate = new Date();
  const endDate = new Date();
  const apiKey = process.env.NEWS_API_KEY;

  const formattedStartDate = `${startDate.getFullYear()}-${String(
    startDate.getDate()
  ).padStart(2, '0')}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
  const formattedEndDate = `${endDate.getFullYear()}-${String(
    endDate.getDate()
  ).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;

  if (!apiKey) {
    res.status(500).json({ error: 'NEWS_API_KEY ist nicht definiert' });
    return;
  }

  try {
    await fetchData(apiKey, formattedStartDate, formattedEndDate);
    res
      .status(200)
      .json({ message: 'Daten erfolgreich abgerufen und gespeichert' });
  } catch (error) {
    console.error('Fehler beim Abrufen und Speichern der Daten:', error);
    res
      .status(500)
      .json({ error: 'Fehler beim Abrufen und Speichern der Daten' });
  }
}
