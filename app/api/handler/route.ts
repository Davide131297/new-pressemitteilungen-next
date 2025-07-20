import { NextRequest, NextResponse } from 'next/server';
import { fetchArticlesFromPresseportal } from '@/lib/fetchers/presseportal';
import { fetchArticlesFromBerlin } from '@/lib/fetchers/berlin';

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

  // Timeout nach 60 Sekunden
  const timeout = setTimeout(() => {
    return NextResponse.json({ message: 'Request timed out' }, { status: 503 });
  }, 60000);

  try {
    // Abrufen von Artikeln von beiden Quellen
    const [presseportalArticles, berlinArticles] = await Promise.all([
      fetchArticlesFromPresseportal(query, startDate, endDate),
      fetchArticlesFromBerlin(query, startDate, endDate),
    ]);

    clearTimeout(timeout);

    const combinedArticles = [...presseportalArticles, ...berlinArticles];

    // Entfernen von Duplikaten
    const uniqueArticles = combinedArticles.filter(
      (article, index, self) =>
        index ===
        self.findIndex(
          (a) =>
            a.fullArticleURL === article.fullArticleURL &&
            a.title === article.title
        )
    );

    return NextResponse.json(uniqueArticles, { status: 200 });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { message: 'Error fetching articles' },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      Allow: 'GET, OPTIONS',
    },
  });
}
