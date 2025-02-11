'use client';

import { useEffect, useState, Suspense } from 'react';
import Header from '@/components/header';
import { NewsItem } from '@/components/myInterfaces';
import { Pagination, Stack } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/footer';
import ArticleCart from '@/components/articleCard';

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
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
            <ArticleCart selectedNews={selectedNews} />
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
