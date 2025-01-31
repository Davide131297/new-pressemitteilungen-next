import { NextResponse } from 'next/server';
import { Document, WithId } from 'mongodb';
import dotenv from 'dotenv';
import { parseISO } from 'date-fns';
import { NewsItem } from '@/components/myInterfaces';
import { getDbClient } from '@/lib/database';

dotenv.config();

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

export async function GET() {
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

    return NextResponse.json(uniqueNews, { status: 200 });
  } catch (error) {
    console.error('Fehler beim Abrufen der Nachrichten:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Nachrichten' },
      { status: 500 }
    );
  }
}
