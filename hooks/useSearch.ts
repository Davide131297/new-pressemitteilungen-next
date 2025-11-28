import { useState, useRef } from 'react';
import { toast } from 'sonner';
import dayjs, { Dayjs } from 'dayjs';
import sendLogs from '@/lib/sendLogs';
import { getDeviceType } from '@/lib/utils';
import { Article } from '@/types/article';

type UseSearchReturn = {
  query: string;
  setQuery: (query: string) => void;
  startDate: Dayjs;
  setStartDate: (date: Dayjs) => void;
  endDate: Dayjs;
  setEndDate: (date: Dayjs) => void;
  data: Article[];
  loading: boolean;
  elapsedTime: number | null;
  handleApiCall: () => Promise<void>;
  handleStopSearch: () => void;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
};

export function useSearch(): UseSearchReturn {
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
    if (!query || !startDate || !endDate) {
      const msg = 'Suchbegriff, Start- und Enddatum müssen ausgewählt werden.';
      console.error(msg);
      toast.error(msg);
      return;
    }

    if (endDate.isBefore(startDate)) {
      toast.error('Startdatum muss vor Enddatum liegen!');
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    const formattedStartDate = startDate.format('DD.MM.YYYY');
    const formattedEndDate = endDate.format('DD.MM.YYYY');

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

      const device = getDeviceType();

      sendLogs(
        'info',
        `Pressesuche durchgeführt: ${query} Zeitraum: ${formattedStartDate} - ${formattedEndDate} mit ${device}`,
        'suche'
      );

      const responseData = await response.json();
      setData(responseData.articles || []);
      setPage(0);
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Fehler beim Abrufen der Artikel:', error);
        toast.error('Fehler beim Abrufen der Artikel');
      }
    } finally {
      const endTime = Date.now();
      const days = endDate.diff(startDate, 'day') + 1;
      const duration = (endTime - startTime) / 1000;
      setElapsedTime(duration);
      setLoading(false);
      sendLogs(
        'info',
        `Ergebnis einer Suche von ${query}: ${days} Tage, ${
          data?.length || 0
        } Artikel gefunden in ${duration} Sekunden`
      );
    }
  };

  function handleStopSearch() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  return {
    query,
    setQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    data,
    loading,
    elapsedTime,
    handleApiCall,
    handleStopSearch,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  };
}
