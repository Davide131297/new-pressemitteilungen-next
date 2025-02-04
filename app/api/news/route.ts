import { NextResponse } from 'next/server';
import { Document, WithId } from 'mongodb';
import dotenv from 'dotenv';
import { parseISO } from 'date-fns';
import { NewsItem } from '@/components/myInterfaces';
import { getDbClient } from '@/lib/database';

dotenv.config();

function normalizeDate(newsItem: WithId<Document>): NewsItem {
  const normalizedItem = newsItem as unknown as NewsItem;
  if (normalizedItem.published_at) {
    normalizedItem.date = parseISO(normalizedItem.published_at);
  }
  return normalizedItem;
}

export async function GET() {
  const client = await getDbClient();
  const db = client.db('Pressemitteilungen');

  try {
    const newsMediaStackCollection = db.collection('News.Mediastack');

    const data = await newsMediaStackCollection.find({}).toArray();

    const newsItem = data.map(normalizeDate);

    const uniqueNews = Array.from(
      new Map(newsItem.map((item) => [item.title, item])).values()
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
