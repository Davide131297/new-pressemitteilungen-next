'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Logo from '@/components/logo';
import MenuBox from '@/components/menu';
import TagesspiegelLogo from '@/assets/Tagesspiegel-Logo.svg';
import SternLogo from '@/assets/Stern-Logo.svg';
import MerkurOnline from '@/assets/Merkur.de-Logo.png';
import DieWelt from '@/assets/Die_Welt.png';
import HNA from '@/assets/HNA.svg';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  image_url: string;
  publishedAt: string;
  item: string;
  published_at: string;
  pubDate: string;
  source_icon: string;
  image: string;
  source: string;
  link: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedNews = news.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuBox />
      <Logo />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center h-[90vh] flex items-center justify-center">
            <p className="text-gray-500">Lade Nachrichten...</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between mt-8 mb-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Zurück
              </button>
              <button
                onClick={handleNextPage}
                disabled={startIndex + itemsPerPage >= news.length}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Weiter
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedNews.map((item, index) => (
                <article
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={
                      item.urlToImage ||
                      item.image ||
                      item.image_url ||
                      'https://placehold.co/600x400/png'
                    }
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
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString()
                          : item.published_at
                          ? new Date(item.published_at).toLocaleDateString()
                          : item.pubDate
                          ? new Date(item.pubDate).toLocaleDateString()
                          : item.image_url}
                      </span>
                      <span className="text-xs">
                        {item.source_icon ? (
                          <Image
                            src={item.source_icon}
                            alt="source icon"
                            className="inline-block w-4 h-4"
                            width={16}
                            height={16}
                          />
                        ) : item.source === 'pnn' ? (
                          <Image
                            src={TagesspiegelLogo}
                            alt="Tagesspiegel Logo"
                            className="inline-block"
                            width={64}
                            height={64}
                          />
                        ) : item.source === 'stern' ? (
                          <Image
                            src={SternLogo}
                            alt="Tagesspiegel Logo"
                            className="inline-block"
                            width={40}
                            height={40}
                          />
                        ) : item.source === 'merkur-online' ? (
                          <Image
                            src={MerkurOnline}
                            alt="Tagesspiegel Logo"
                            className="inline-block"
                            width={48}
                            height={48}
                          />
                        ) : item.source === 'DIE WELT' ? (
                          <Image
                            src={DieWelt}
                            alt="Tagesspiegel Logo"
                            className="inline-block"
                            width={48}
                            height={48}
                          />
                        ) : item.source === 'hna' ? (
                          <Image
                            src={HNA}
                            alt="Tagesspiegel Logo"
                            className="inline-block"
                            width={30}
                            height={30}
                          />
                        ) : null}
                      </span>
                    </div>
                    <a
                      href={item.url || item.link}
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
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Zurück
              </button>
              <button
                onClick={handleNextPage}
                disabled={startIndex + itemsPerPage >= news.length}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Weiter
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-500 text-white text-center py-4 mt-8">
        <p className="text-sm">© 2024 PresseFinder. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
