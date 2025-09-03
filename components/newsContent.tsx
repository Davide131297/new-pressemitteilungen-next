import { NewsItem } from '@/components/myInterfaces';
import { Pagination, Stack } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import ArticleCart from '@/components/articleCard';

export default function NewsContent({
  newsData,
  loading,
}: {
  newsData: NewsItem[];
  loading: boolean;
}) {
  const itemsPerPage = 16;
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams
    ? parseInt(searchParams.get('page') || '1', 10)
    : 1;

  const totalPages = Math.ceil(newsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedNews = newsData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}`);
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
