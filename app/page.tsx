'use client';

import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import 'dayjs/locale/de';
import dayjs from 'dayjs';

import Search from '../components/search';
import ArticleTable from '../components/articleTable';
import CitySummaryTable from '../components/citySummaryTable';
import Karte from '../components/karte';
import Welcome from '@/components/welcome';
import { getCoordinates } from '@/components/getCoordinates';
import sendLogs from '@/lib/sendLogs';
import TextBox from '@/components/textBox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

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

type City = {
  latitude: number;
  longitude: number;
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
  const [tabIndex, setTabIndex] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<ArticleResponse | null>(null);
  const [pendingCity, setPendingCity] = useState<City | null>(null);

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
        const city = await getCoordinates(query);
        console.log(city);

        if (city.latitude && city.longitude) {
          // Show custom dialog instead of confirm
          setPendingData(data);
          setPendingCity(city);
          setShowConfirmDialog(true);
          // Return here, continue after dialog response
          return;
        } else {
          // Wenn keine Koordinaten gefunden wurden, alle Pressemeldungen anzeigen
          console.log('Keine Koordinaten gefunden:', city);
          setData(data.articles);
        }
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

  // Handler for dialog response
  const handleDialogResponse = (confirmed: boolean) => {
    if (pendingData && pendingCity) {
      if (confirmed) {
        // Ja: filter data for the city
        const filteredData = pendingData.articles.filter(
          (item: { standort: string }) =>
            item.standort.toLowerCase() === query.toLowerCase()
        );
        setData(filteredData);
      } else {
        // Nein: show all articles
        setData(pendingData.articles);
      }
      setPage(0);
    }
    setShowConfirmDialog(false);
    setPendingData(null);
    setPendingCity(null);
  };

  const handleTabChange = (value: string) => {
    const tabName = value === 'table' ? 'Tabelle' : 'Karte';
    sendLogs('info', `Tab gewechselt: ${tabName}`);
    setTabIndex(value === 'table' ? 0 : 1);
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
              <Tabs
                defaultValue="table"
                value={tabIndex === 0 ? 'table' : 'map'}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <div className="flex justify-center mb-3">
                  <TabsList className="grid w-[400px] grid-cols-2">
                    <TabsTrigger value="table">Tabelle</TabsTrigger>
                    <TabsTrigger value="map">Karte</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="table" className="mt-0">
                  <ArticleTable
                    data={data}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                  />
                </TabsContent>
                <TabsContent value="map" className="mt-0">
                  <Karte data={data} />
                </TabsContent>
              </Tabs>
            </div>
            <div className="mt-3">
              <CitySummaryTable data={data} />
            </div>
          </div>
        )}
        <Welcome />
        {data && data.length > 0 && <TextBox data={data} />}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="w-[90vw] max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Stadt bestätigen
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Möchtest du nur Pressemeldungen für{' '}
                <span className="font-semibold text-blue-600">{query}</span>{' '}
                anzeigen oder alle gefundenen Artikel sehen?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => handleDialogResponse(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Alle Artikel anzeigen
              </Button>
              <Button
                onClick={() => handleDialogResponse(true)}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Nur {query} anzeigen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}

export default Home;
