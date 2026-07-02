'use client';

import { useEffect, useState, Suspense } from 'react';
import NewsContent from '@/components/newsContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/page-container';
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
        if (Array.isArray(data)) {
          setNewsData(data);
        } else {
          console.error('Unerwartete Antwort von /api/news:', data);
          toast.error('Fehler beim Laden der Nachrichten');
        }
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
        const articles = data?.response?.articles;
        if (Array.isArray(articles)) {
          setNewsData(articles);
          toast.success(`${articles.length} Artikel gefunden`);
        } else {
          console.error('Unerwartete Antwort von /api/news/search:', data);
          toast.error('Fehler beim Suchen der Nachrichten');
        }
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
    <PageContainer>
      <Card className="mb-8 p-4 sm:p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Nachrichten Suche
          </h1>
          <p className="text-muted-foreground">
            Durchsuchen Sie aktuelle Nachrichten und Artikel
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Suchbegriff eingeben..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pl-10 pr-4 py-3 text-base"
              disabled={searchLoading}
            />
          </div>
          <Button
            onClick={handleOnClick}
            disabled={searchLoading}
            className="px-6 py-3 font-medium"
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
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Lade Nachrichten...</p>
          </Card>
        }
      >
        <NewsContent newsData={newsData} loading={loading} />
      </Suspense>
    </PageContainer>
  );
}
