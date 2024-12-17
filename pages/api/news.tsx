import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.4k82o.mongodb.net/?retryWrites=true&w=majority;`;

let dbClient: MongoClient;

async function getDbClient() {
  if (!dbClient) {
    try {
      dbClient = new MongoClient(uri);
      await dbClient.connect();
      console.log('Datenbank-Verbindung hergestellt');
    } catch (error) {
      console.error('Fehler beim Herstellen der Datenbank-Verbindung:', error);
    }
  }
  return dbClient;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await getDbClient();
  const db = client.db('Pressemitteilungen');

  try {
    const newsApiCollection = db.collection('News.API');
    const newsDataCollection = db.collection('News.DATA');

    const [newsApi, news] = await Promise.all([
      newsApiCollection.find({}).toArray(),
      newsDataCollection.find({}).toArray(),
    ]);

    const combinedNews = [...newsApi, ...news];

    res.status(200).json(combinedNews);
  } catch (error) {
    console.error('Fehler beim Abrufen der Nachrichten:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Nachrichten' });
  }
}
