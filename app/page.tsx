'use client'

import React, { useState } from 'react';
import { Tabs, Tab, Box, } from '@mui/material';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Image from 'next/image';

import SearchPC from '../components/searchPC';
import SearchMobile from '../components/searchMobile';
import ArticleTable from '../components/articleTable';
import CitySummaryTable from '../components/citySummaryTable';
import Karte from '../components/karte';
import FinderLogo from '../assets/FinderIcon.png';
import Welcome from '@/components/welcome';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Home() {
  const [query, setQuery] = useState('Aktenzeichen XY');
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

  const handleApiCall = async () => {
    if (startDate && endDate) {
      setLoading(true);
      const startTime = Date.now();
      const formattedStartDate = dayjs(startDate).format('DD.MM.YYYY');
      const formattedEndDate = dayjs(endDate).format('DD.MM.YYYY');

      if (dayjs(endDate).isBefore(dayjs(startDate))) {
        setLoading(false);
        setOpen(true);
        return;
      }

      const apiUrl = `/api/handler?query=${encodeURIComponent(query)}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
  
        const data = await response.json();
        setData(data); // Daten in den Zustand setzen
        setPage(0);    // Optional: Tabelle auf erste Seite zurücksetzen
      } catch (error) {
        console.error('Fehler beim Abrufen der Artikel:', error);
      } finally {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // Dauer in Sekunden
        setElapsedTime(duration);
        setLoading(false);
      }
    } else {
      console.error('Start- und Enddatum müssen ausgewählt werden.');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div className='py-4'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          color: 'black',
          width: '100%',
        }}
      >
        <Image src={FinderLogo} alt="Finder Logo" className="w-15 mr-5" />        
        <h1>PresseFinder</h1>
      </Box>
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
        />
      )}
      <Box sx={{ marginTop: '30px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      <Divider variant="middle" sx={{marginTop: '10px', marginBottom: '10px'}}/>
      <Welcome />
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
          sx={{ width: '100%' }}
        >
          Startdatum muss vor Enddatum liegen!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Home;