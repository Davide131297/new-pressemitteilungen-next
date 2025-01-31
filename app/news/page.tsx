'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import { NewsItem } from '@/components/myInterfaces';
import { sourceImages } from '@/components/sourceImages';
import { Pagination, Stack } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/footer';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

function NewsContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 16;

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams
    ? parseInt(searchParams.get('page') || '1', 10)
    : 1;

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

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}`);
  };

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedNews = news.slice(startIndex, startIndex + itemsPerPage);

  function getSourceImage(source: keyof typeof sourceImages) {
    return sourceImages[source] || null;
  }

  const alertArticle = async (item: NewsItem) => {
    const userConfirmed = confirm(
      'Möchten sie diesen Artikel/Herausgeber melden?'
    );
    if (userConfirmed) {
      try {
        const response = await fetch('/api/savetodb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ collectionName: 'Alerts', data: item }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Artikel/Herausgeber wurde gemeldet:', result);
          alert('Artikel/Herausgeber wurde gemeldet.');
        } else {
          console.error(
            'Fehler beim Melden des Artikels/Herausgebers:',
            response.statusText
          );
          alert('Fehler beim Melden des Artikels/Herausgebers.');
        }
      } catch (error) {
        console.error('Fehler beim Melden des Artikels/Herausgebers:', error);
        alert('Fehler beim Melden des Artikels/Herausgebers.');
      }
    }
  };

  return (
    <div>
      {loading ? (
        <div className="text-center h-[90vh] flex items-center justify-center">
          <p className="text-gray-500">Lade Nachrichten...</p>
        </div>
      ) : (
        <div>
          <Stack spacing={2} alignItems="center" className="mb-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => handlePageChange(page)}
              color="primary"
            />
          </Stack>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {selectedNews.map((item, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="relative">
                    <Image
                      src={
                        item.urlToImage ||
                        item.image ||
                        item.image_url ||
                        'https://fakeimg.pl/600x400?text=Kein+Bild'
                      }
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-40 object-cover"
                    />
                    <div
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full cursor-pointer w-6 h-6 flex items-center justify-center"
                      onClick={() => alertArticle(item)}
                      title="Melden"
                    >
                      <PriorityHighOutlinedIcon sx={{ fontSize: '1rem' }} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      {item.description || 'Keine Beschreibung verfügbar'}
                    </p>
                  </div>
                </div>
                <div className="p-4 mt-auto">
                  <div className="flex items-center justify-between text-sm text-gray-500">
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
                      {(() => {
                        const sourceData = getSourceImage(
                          item.source as keyof typeof sourceImages
                        );
                        return sourceData ? (
                          <Image
                            src={sourceData.src}
                            alt={sourceData.alt}
                            className="inline-block"
                            width={sourceData.width}
                            height={sourceData.height}
                          />
                        ) : null;
                      })()}
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
          <Stack spacing={2} alignItems="center" className="mt-8">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => handlePageChange(page)}
              color="primary"
            />
          </Stack>
        </div>
      )}
    </div>
  );
}

export default function News() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center">Lade Inhalte...</div>}>
          <NewsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
