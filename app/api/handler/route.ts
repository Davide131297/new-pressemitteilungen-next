import { NextRequest, NextResponse } from 'next/server';

import { fetchArticlesFromPresseportal } from '@/lib/fetchers/presseportal';
import { fetchArticlesFromBerlin } from '@/lib/fetchers/berlin';
import { fetchArticlesFromGreenpeace } from '@/lib/fetchers/greenpeace';
import { decodeHTMLEntities } from '@/helper/decode-html.entities';

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

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const { sources } = await req.json();

  console.log('Sources:', sources);

  if (!query || !startDate || !endDate || !sources || !Array.isArray(sources)) {
    return NextResponse.json(
      { message: 'Missing required query parameters or sources' },
      { status: 400 }
    );
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60_000);

  try {
    const fetchers = [];
    if (sources.includes('presseportal')) {
      fetchers.push(fetchArticlesFromPresseportal(query, startDate, endDate));
    }
    if (sources.includes('berlin')) {
      fetchers.push(fetchArticlesFromBerlin(query, startDate, endDate));
    }
    if (sources.includes('greenpeace')) {
      fetchers.push(fetchArticlesFromGreenpeace(query, startDate, endDate));
    }

    const results = await Promise.all(fetchers);
    clearTimeout(timer);

    const combined: Article[] = results.flat();
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
          ? decodeHTMLEntities(
              (teaserResults[idx] as PromiseFulfilledResult<string>).value
            )
              .replace(/✚ Mehr lesen$/i, '')
              .trim()
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
    return NextResponse.json(
      { message: 'Error fetching articles' },
      { status: 500 }
    );
  }
}
