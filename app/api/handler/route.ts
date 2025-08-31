import { NextRequest, NextResponse } from 'next/server';
import { fetchArticlesFromPresseportal } from '@/lib/fetchers/presseportal';
import { fetchArticlesFromBerlin } from '@/lib/fetchers/berlin';
import { fetchTeaser } from '@/lib/teaser';

type Article = {
  titel?: string;
  title?: string;
  fullArticleURL: string;
  date?: string;
  standort?: string;
  latitude?: number;
  longitude?: number;
  source?: string;
  bundesland?: string;
};

function buildItems(arts: Array<Article>, limit = 10) {
  return arts
    .slice(0, limit)
    .map((a) => ({
      title: (a.titel ?? a.title ?? '').toString().trim(),
      url: a.fullArticleURL,
      city: a.standort ?? '',
      date: a.date ?? '',
    }))
    .filter((i) => i.title);
}

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

    const combined: Article[] = [...presseportalArticles, ...berlinArticles];
    const uniqueArticles = combined.filter(
      (article, index, self) =>
        index ===
        self.findIndex(
          (a) =>
            a.fullArticleURL === article.fullArticleURL &&
            (a.titel ?? a.title) === (article.titel ?? article.title)
        )
    );

    if (uniqueArticles.length === 0) {
      return NextResponse.json(
        { summary: null, articles: [] },
        { status: 200 }
      );
    }

    const items = buildItems(uniqueArticles, 10);

    const teaserResults = await Promise.allSettled(
      items.map((i) => fetchTeaser(i.url, ctrl.signal).then((t) => t ?? ''))
    );

    const itemsWithTeaser = items.map((it, idx) => ({
      title: it.title,
      teaser:
        teaserResults[idx].status === 'fulfilled'
          ? (teaserResults[idx] as PromiseFulfilledResult<string>).value
          : '',
      url: it.url,
      city: it.city,
      date: it.date,
    }));

    return NextResponse.json(
      {
        summary: itemsWithTeaser,
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
