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

function Home() {
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const matches = useMediaQuery('(max-width:600px)');
  const [open, setOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

  const handleApiCall = async () => {
    if (query && startDate && endDate) {
      setLoading(true);
      const startTime = Date.now();
      const formattedStartDate = dayjs(startDate).format('DD.MM.YYYY');
      const formattedEndDate = dayjs(endDate).format('DD.MM.YYYY');

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

        sendLogs('info', `Pressesuche durchgeführt`, {
          query,
          startDate: JSON.stringify(startDate),
          endDate: JSON.stringify(endDate),
        });

        const data = await response.json();
        const city = await getCoordinates(query);
        console.log(city);

        if (city.latitude && city.longitude) {
          const userConfirmed = confirm(
            `Möchten Sie nur Pressemeldungen für ${query} sehen?`
          );
          if (userConfirmed) {
            // Logik, um nur Pressemeldungen für die Stadt anzuzeigen
            const filteredData = data.filter(
              (item: { standort: string }) =>
                item.standort.toLowerCase() === query.toLowerCase()
            );
            setData(filteredData);
          } else {
            // Logik, um alle Pressemeldungen anzuzeigen
            console.log('Abgebrochen: Alle Pressemeldungen anzeigen', data);
            setData(data); // Daten in den Zustand setzen
          }
        } else {
          // Wenn keine Koordinaten gefunden wurden, alle Pressemeldungen anzeigen
          console.log('Keine Koordinaten gefunden:', city);
          setData(data);
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
        const duration = (endTime - startTime) / 1000; // Dauer in Sekunden
        setElapsedTime(duration);
        setLoading(false);
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

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
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
    </div>
  );
}

export default Home;
