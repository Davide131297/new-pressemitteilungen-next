'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Logo from '@/components/logo';
import MenuBox from '@/components/menu';

interface NewsItem {
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const response = await fetch('/api/news');
        const newsData: NewsItem[] = await response.json();
        setNews(newsData);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Fehler beim Laden der Nachrichten:', error.message);
        } else {
          console.error('Unbekannter Fehler beim Laden der Nachrichten');
        }
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuBox />
      <Logo />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">
            <p className="text-gray-500">Lade Nachrichten...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Image
                  src={item.urlToImage || 'https://placehold.co/600x400/png'}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    {item.description || 'Keine Beschreibung verfügbar'}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs">{item.author}</span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 text-sky-500 text-sm font-semibold hover:underline"
                  >
                    Artikel lesen
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-500 text-white text-center py-4 mt-8">
        <p className="text-sm">© 2024 News Portal. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
