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

export async function fetchArticlesFromMediaStack(
  query: string
): Promise<Article[]> {
  try {
    const mediaStackResponse = await fetch(
      `https://api.mediastack.com/v1/news?access_key=${process.env.NEWS_MEDIASTACK_KEY}&keywords=${query}`
    );
    const mediaStackData = await mediaStackResponse.json();

    return (
      (mediaStackData.data || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((article: any) =>
          ALLOWED_SOURCES.has(article.source?.toLowerCase())
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((article: any) => ({
          title: article.title,
          fullArticleURL: article.url,
          date: format(new Date(article.published_at), 'dd.MM.yyyy'),
          source: article.source,
        }))
    );
  } catch (error) {
    console.error('Error fetching from MediaStack:', error);
    return [];
  }
}
