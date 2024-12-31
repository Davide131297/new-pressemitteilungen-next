import { NextApiRequest, NextApiResponse } from 'next';
import { fetchArticlesFromPresseportal } from '@/lib/fetchers/presseportal';
import { fetchArticlesFromBerlin } from '@/lib/fetchers/berlin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { query, startDate, endDate } = req.query;

    // Überprüfung auf fehlende Parameter
    if (!query || !startDate || !endDate) {
      return res
        .status(400)
        .send('Missing query, startDate, or endDate parameter');
    }

    // Timeout nach 60 Sekunden
    const timeout = setTimeout(() => {
      res.status(503).send('Request timed out');
    }, 60000);

    try {
      // Abrufen von Artikeln von beiden Quellen
      const [presseportalArticles, berlinArticles] = await Promise.all([
        fetchArticlesFromPresseportal(
          query as string,
          startDate as string,
          endDate as string
        ),
        fetchArticlesFromBerlin(
          query as string,
          startDate as string,
          endDate as string
        ),
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

      res.status(200).json(uniqueArticles);
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error fetching articles:', error);
      res.status(500).send('Error fetching articles');
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
