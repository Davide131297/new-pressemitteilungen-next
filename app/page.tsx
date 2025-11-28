'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import Search from '../components/search';
import ArticleTable from '../components/articleTable';
import Welcome from '@/components/welcome';
import sendLogs from '@/lib/sendLogs';
import TextBox from '@/components/textBox';
import { Card } from '@/components/ui/card';

type ArticleResponse = {
  articles: Article[];
};

export type Article = {
  id: string;
  title: string;
  standort: string;
  date: string;
  fullArticleURL: string;
  bundesland: string;
};

function Home() {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleApiCall = async () => {
    if (query && startDate && endDate) {
      setLoading(true);
      const startTime = Date.now();
      const formattedStartDate = dayjs(startDate).format('DD.MM.YYYY');
      const formattedEndDate = dayjs(endDate).format('DD.MM.YYYY');
      let duration = 0;
      let data = null;

      if (dayjs(endDate).isBefore(dayjs(startDate))) {
        setLoading(false);
        toast.error('Startdatum muss vor Enddatum liegen!');
        return;
      }

      const apiUrl = `/api/handler?query=${encodeURIComponent(
        query
      )}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const device =
          typeof navigator === 'undefined'
            ? 'unknown'
            : /ipad|tablet/i.test(navigator.userAgent)
            ? 'tablet'
            : /mobi|android/i.test(navigator.userAgent)
            ? 'mobile'
            : 'desktop';

        sendLogs(
          'info',
          `Pressesuche durchgeführt: ${query} Zeitraum: ${formattedStartDate} - ${formattedEndDate} mit ${device}`,
          'suche'
        );

        data = (await response.json()) as ArticleResponse;
        setData(data.articles);
        setPage(0); // Optional: Tabelle auf erste Seite zurücksetzen
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fehler beim Abrufen der Artikel:', error);
        }
      } finally {
        const endTime = Date.now();
        const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
        duration = (endTime - startTime) / 1000; // Dauer in Sekunden
        setElapsedTime(duration);
        setLoading(false);
        sendLogs(
          'info',
          `Ergebnis einer Suche von ${query}: ${days} Tage, ${data?.articles.length} Artikel gefunden in ${duration} Sekunden`
        );
      }
    } else {
      console.error(
        'Suchbegriff, Start- und Enddatum müssen ausgewählt werden.'
      );
      toast.error('Suchbegriff, Start- und Enddatum müssen ausgewählt werden.');
      return;
    }
  };

  function handleStopSearch() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  return (
    <div className="w-11/12 mx-auto mb-5">
      <Card className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border-0 shadow-xl p-5">
        <Search
          query={query}
          setQuery={setQuery}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleApiCall={handleApiCall}
          loading={loading}
          elapsedTime={elapsedTime}
          data={data}
          handleStopSearch={handleStopSearch}
        />
        {data.length !== 0 && (
          <div className="mt-2">
            <div className="flex justify-center">
              <ArticleTable
                data={data}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          </div>
        )}
        {!data.length && <Welcome />}
        {data && data.length > 0 && <TextBox data={data} />}
      </Card>
    </div>
  );
}

export default Home;
