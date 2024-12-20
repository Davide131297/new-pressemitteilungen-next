'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Logo from '@/components/logo';
import MenuBox from '@/components/menu';
import { NewsItem } from '@/components/myInterfaces';
import { sourceImages } from '@/components/sourceImages';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const itemsPerPage = 16;

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

  const handleSourceChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedSources(
      typeof value === 'string' ? value.split(',') : (value as string[])
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredNews = news.filter((item) => {
    const source =
      typeof item.source === 'object' ? item.source.id : item.source;
    return selectedSources.length === 0 || selectedSources.includes(source);
  });
  const selectedNews = filteredNews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  function getSourceImage(source: keyof typeof sourceImages) {
    return sourceImages[source] || null;
  }

  const sources = new Set<string>();
  news.forEach((item) => {
    if (item.source) {
      const source =
        typeof item.source === 'object' ? item.source.id : item.source;
      sources.add(source);
    }
  });

  const sourceArray = Array.from(sources);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
                disabled={startIndex + itemsPerPage >= filteredNews.length}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Weiter
              </button>
            </div>
            <div className="mb-4">
              <FormControl fullWidth>
                <InputLabel id="source-select-label">
                  Quellen auswählen
                </InputLabel>
                <Select
                  labelId="source-select-label"
                  id="source-select"
                  multiple
                  value={selectedSources}
                  onChange={handleSourceChange}
                  input={<OutlinedInput label="Quellen auswählen" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {sourceArray.map((source) => (
                    <MenuItem key={source} value={source}>
                      <Checkbox
                        checked={selectedSources.indexOf(source as string) > -1}
                      />
                      <ListItemText primary={source as string} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                      'https://via.placeholder.com/600x400?text=Kein+Bild'
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
                disabled={startIndex + itemsPerPage >= filteredNews.length}
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
