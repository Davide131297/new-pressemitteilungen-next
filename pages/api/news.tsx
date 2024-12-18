import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Document, WithId } from 'mongodb';
import dotenv from 'dotenv';
import { parseISO } from 'date-fns';
import { NewsItem } from '@/components/myInterfaces';

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

function normalizeDate(newsItem: WithId<Document>): NewsItem {
  const normalizedItem = newsItem as unknown as NewsItem;
  if (normalizedItem.publishedAt) {
    normalizedItem.date = parseISO(normalizedItem.publishedAt);
  } else if (normalizedItem.pubDate) {
    normalizedItem.date = parseISO(normalizedItem.pubDate.replace(' ', 'T'));
  } else if (normalizedItem.published_at) {
    normalizedItem.date = parseISO(normalizedItem.published_at);
  }
  return normalizedItem;
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
    const newsMediaStackCollection = db.collection('News.Mediastack');

    const [newsApi, news, mediaStack] = await Promise.all([
      newsApiCollection.find({}).toArray(),
      newsDataCollection.find({}).toArray(),
      newsMediaStackCollection.find({}).toArray(),
    ]);

    const combinedNews = [...newsApi, ...news, ...mediaStack].map(
      normalizeDate
    );

    const uniqueNews = Array.from(
      new Map(combinedNews.map((item) => [item.title, item])).values()
    );

    uniqueNews.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.getTime() - a.date.getTime();
    });

    res.status(200).json(uniqueNews);
  } catch (error) {
    console.error('Fehler beim Abrufen der Nachrichten:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Nachrichten' });
  }
}
