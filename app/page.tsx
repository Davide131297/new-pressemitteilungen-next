'use client';

import React, { useState, SyntheticEvent, useRef } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';

import SearchPC from '../components/searchPC';
import SearchMobile from '../components/searchMobile';
import ArticleTable from '../components/articleTable';
import CitySummaryTable from '../components/citySummaryTable';
import Karte from '../components/karte';
import Welcome from '@/components/welcome';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getCoordinates } from '@/components/getCoordinates';
import sendLogs from '@/lib/sendLogs';
import TextBox from '@/components/textBox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export type SummaryItem = {
  city: string;
  teaser: string;
  title: string;
  url: string;
  date: string;
};

type ArticleResponse = {
  articles: Article[];
  summary: SummaryItem[] | null;
};

type Article = {
  id: string;
  title: string;
  content: string;
  standort: string;
  date: string;
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
  const matches = useMediaQuery('(max-width:600px)');
  const [open, setOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [summary, setSummary] = useState<SummaryItem[] | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<ArticleResponse | null>(null);
  const [pendingCity, setPendingCity] = useState<City | null>(null);

  const handleApiCall = async (device: string) => {
    if (query && startDate && endDate) {
      setLoading(true);
      const startTime = Date.now();
      const formattedStartDate = dayjs(startDate).format('DD.MM.YYYY');
      const formattedEndDate = dayjs(endDate).format('DD.MM.YYYY');
      let duration = 0;
      let data = null;

      if (dayjs(endDate).isBefore(dayjs(startDate))) {
        setLoading(false);
        setOpen(true);
        setAlertMessage('Startdatum muss vor Enddatum liegen!');
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
          console.log('Summary: ', data.summary);
          setSummary(data.summary);
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
      setOpen(true);
      setAlertMessage(
        'Suchbegriff, Start- und Enddatum müssen ausgewählt werden.'
      );
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
        setSummary(pendingData.summary);
      } else {
        // Nein: show all articles
        setData(pendingData.articles);
        setSummary(pendingData.summary);
      }
      setPage(0);
    }
    setShowConfirmDialog(false);
    setPendingData(null);
    setPendingCity(null);
  };

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    const tabName = newValue === 0 ? 'Tabelle' : 'Karte';
    sendLogs('info', `Tab gewechselt: ${tabName}`);
    setTabIndex(newValue);
  };

  const handleClose = () => {
    setOpen(false);
    setAlertMessage('');
  };

  function handleStopSearch() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '80%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      {matches ? (
        <SearchMobile
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
        />
      ) : (
        <SearchPC
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
      )}
      {data.length !== 0 && (
        <Box sx={{ marginTop: '30px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="Tabelle" />
              <Tab label="Karte" />
            </Tabs>
          </Box>
          {tabIndex === 0 && (
            <Box sx={{ marginTop: '10px' }}>
              <ArticleTable
                data={data}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </Box>
          )}
          {tabIndex === 1 && (
            <Box sx={{ marginTop: '10px' }}>
              <Karte data={data} />
            </Box>
          )}
          <Box sx={{ marginTop: '10px' }}>
            <CitySummaryTable data={data} />
          </Box>
        </Box>
      )}
      <Divider
        variant="middle"
        sx={{ marginTop: '10px', marginBottom: '10px' }}
      />
      <Welcome />
      {summary && <TextBox summary={summary} />}
      <Dialog
        open={showConfirmDialog}
        onClose={() => handleDialogResponse(false)}
      >
        <DialogTitle>Stadt bestätigen</DialogTitle>
        <DialogContent>
          Möchtest du nur Pressemeldungen für <b>{query}</b> sehen?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogResponse(false)} color="primary">
            Nein
          </Button>
          <Button
            onClick={() => handleDialogResponse(true)}
            color="primary"
            autoFocus
          >
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
