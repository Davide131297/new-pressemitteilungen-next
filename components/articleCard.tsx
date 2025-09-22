import { NewsItem } from '@/components/myInterfaces';
import Image from 'next/image';
import {
  AlertTriangle,
  ExternalLink,
  Calendar,
  Building2,
  ImageOff,
} from 'lucide-react';
import { sourceImages } from '@/components/sourceImages';
import Link from 'next/link';
import sendLogs from '@/lib/sendLogs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useState } from 'react';

type ArticleCartProps = {
  selectedNews: NewsItem[];
};

export default function ArticleCart({ selectedNews }: ArticleCartProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => new Set(prev).add(itemId));
  };

  const alertArticle = async (item: NewsItem) => {
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
        toast.success('Artikel/Herausgeber wurde erfolgreich gemeldet.');
      } else {
        console.error(
          'Fehler beim Melden des Artikels/Herausgebers:',
          response.statusText
        );
        toast.error('Fehler beim Melden des Artikels/Herausgebers.');
      }
    } catch (error) {
      console.error('Fehler beim Melden des Artikels/Herausgebers:', error);
      toast.error('Fehler beim Melden des Artikels/Herausgebers.');
    }
  };

  const handleArticleClick = async (
    item: NewsItem,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    try {
      await sendLogs(
        'info',
        `Artikel geklickt: ${item.title} (${item.url || item.link})`,
        'article'
      );
      window.open(item.url || item.link, '_blank');
    } catch (err) {
      console.error('Fehler beim Senden der Logs:', err);
    }
  };

  function getSourceImage(source: keyof typeof sourceImages) {
    return sourceImages[source] || null;
  }

  function getPublishedDate(item: NewsItem): Date | null {
    return item.publishedAt
      ? new Date(item.publishedAt)
      : item.published_at
      ? new Date(item.published_at)
      : item.pubDate
      ? new Date(item.pubDate)
      : null;
  }

  const sortedNews = [...selectedNews].sort((a, b) => {
    const dateA = getPublishedDate(a)?.getTime() || 0;
    const dateB = getPublishedDate(b)?.getTime() || 0;
    return dateB - dateA;
  });

  return (
    <>
      {sortedNews.map((item) => {
        const itemId = item.url || item.link;
        const hasImageError = imageErrors.has(itemId);
        const imageUrl = item.urlToImage || item.image || item.image_url;

        return (
          <Card
            key={itemId}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-blue-300"
          >
            <CardHeader className="p-0 relative">
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {!hasImageError && imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleImageError(itemId)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageOff className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-3 right-3 h-8 w-8 p-0 shadow-lg hover:shadow-xl transition-shadow"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Artikel melden
                      </DialogTitle>
                      <DialogDescription>
                        Möchten Sie diesen Artikel oder Herausgeber melden?
                        Diese Aktion wird zur Überprüfung an die Administratoren
                        weitergeleitet.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Abbrechen</Button>
                      <Button
                        variant="destructive"
                        onClick={() => alertArticle(item)}
                      >
                        Melden
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="p-4 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {item.description || 'Keine Beschreibung verfügbar'}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Calendar className="h-4 w-4" />
                <span>
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString('de-DE')
                    : item.published_at
                    ? new Date(item.published_at).toLocaleDateString('de-DE')
                    : item.pubDate
                    ? new Date(item.pubDate).toLocaleDateString('de-DE')
                    : 'Datum unbekannt'}
                </span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const sourceKey =
                    typeof item.source === 'string'
                      ? item.source
                      : item.source?.name;
                  const sourceData = getSourceImage(
                    sourceKey as keyof typeof sourceImages
                  );
                  return sourceData ? (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <Image
                        src={sourceData.src}
                        alt={sourceData.alt}
                        width={sourceData.width}
                        height={sourceData.height}
                        className="max-h-6 w-auto"
                      />
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      {sourceKey || 'Unbekannte Quelle'}
                    </Badge>
                  );
                })()}
              </div>

              <Link
                href={item.url || item.link}
                onClick={(event) => handleArticleClick(item, event)}
              >
                <Button size="sm" className="gap-2" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                  Lesen
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}
