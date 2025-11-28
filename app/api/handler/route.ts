import { NextRequest, NextResponse } from 'next/server';
import { fetchArticlesFromPresseportal } from '@/lib/fetchers/presseportal';
import { fetchArticlesFromBerlin } from '@/lib/fetchers/berlin';
import { format } from 'date-fns';

type Article = {
  title?: string;
  fullArticleURL: string;
  date?: string;
  source?: string;
};

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!query || !startDate || !endDate) {
    return NextResponse.json(
      { message: 'Missing required query parameters' },
      { status: 400 }
    );
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60_000);

  try {
    const [presseportalArticles, berlinArticles] = await Promise.all([
      fetchArticlesFromPresseportal(query, startDate, endDate),
      fetchArticlesFromBerlin(query, startDate, endDate),
    ]);

    clearTimeout(timer);

    const mediaStackResponse = await fetch(
      `https://api.mediastack.com/v1/news?access_key=${process.env.NEWS_MEDIASTACK_KEY}&keywords=${query}`
    );
    const mediaStackData = await mediaStackResponse.json();

    console.log('MediaStack Artikel: ', mediaStackData);

    const mappedMediaStackArticles: Article[] = (mediaStackData.data || [])
      .filter((article: any) =>
        ALLOWED_SOURCES.has(article.source?.toLowerCase())
      )
      .map((article: any) => ({
        title: article.title,
        fullArticleURL: article.url,
        date: format(article.published_at, 'dd.MM.yyyy'),
        source: article.source,
      }));

    const combined: Article[] = [
      ...presseportalArticles,
      ...berlinArticles,
      ...mappedMediaStackArticles,
    ];
    const uniqueArticles = combined.filter(
      (article, index, self) =>
        index ===
        self.findIndex(
          (a) =>
            a.fullArticleURL === article.fullArticleURL &&
            a.title === article.title
        )
    );

    if (uniqueArticles.length === 0) {
      return NextResponse.json(
        { summary: null, articles: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        articles: uniqueArticles,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    clearTimeout(timer);
    if ((err as Error)?.name === 'AbortError') {
      return NextResponse.json(
        { message: 'Request timed out' },
        { status: 503 }
      );
    }
    console.error('Error fetching/summarizing:', err);
    return NextResponse.json(
      { message: 'Error fetching articles' },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: { Allow: 'GET, OPTIONS' },
  });
}
