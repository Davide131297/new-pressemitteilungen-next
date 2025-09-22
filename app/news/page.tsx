'use client';

import { useEffect, useState, Suspense } from 'react';
import NewsContent from '@/components/newsContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { NewsItem } from '@/components/myInterfaces';

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    // Basisnachrichten laden beim ersten Render
    fetch('/api/news')
      .then((response) => response.json())
      .then((data) => {
        setNewsData(data);
      })
      .catch((error) => {
        console.error('Fehler beim Laden der Basisnachrichten:', error);
        toast.error('Fehler beim Laden der Nachrichten');
      })
      .finally(() => setLoading(false));
  }, []);

  function handleOnClick() {
    if (searchTerm.trim() === '') {
      toast.error('Bitte geben Sie einen Suchbegriff ein.');
      return;
    }
    setSearchLoading(true);
    fetch(`/api/news/search?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setNewsData(data.response.articles);
        toast.success(`${data.response.articles.length} Artikel gefunden`);
      })
      .catch(() => {
        toast.error('Fehler beim Suchen der Nachrichten');
      })
      .finally(() => setSearchLoading(false));
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOnClick();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Nachrichten Suche
            </h1>
            <p className="text-gray-600">
              Durchsuchen Sie aktuelle Nachrichten und Artikel
            </p>
          </div>

          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Suchbegriff eingeben..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10 pr-4 py-3 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                disabled={searchLoading}
              />
            </div>
            <Button
              onClick={handleOnClick}
              disabled={searchLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {searchLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suchen...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Suchen
                </>
              )}
            </Button>
          </div>
        </Card>

        <Suspense
          fallback={
            <Card className="p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Lade Nachrichten...</p>
            </Card>
          }
        >
          <NewsContent newsData={newsData} loading={loading} />
        </Suspense>
      </main>
    </div>
  );
}
