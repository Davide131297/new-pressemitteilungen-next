'use client'

import React, { useState } from 'react';
import { Tabs, Tab, Box, } from '@mui/material';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Image from 'next/image';

import SearchPC from '../components/searchPC';
import SearchMobile from '../components/searchMobile';
import ArticleTable from '../components/articleTable';
import CitySummaryTable from '../components/citySummaryTable';
import Karte from '../components/karte';
import FinderLogo from '../assets/FinderIcon.png';

function Home() {
  const [query, setQuery] = useState('Ampel');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const matches = useMediaQuery('(max-width:600px)');

  const handleApiCall = async () => {
    if (startDate && endDate) {
      setLoading(true);
      const startTime = Date.now();
      const formattedStartDate = dayjs(startDate).format('DD.MM.YYYY');
      const formattedEndDate = dayjs(endDate).format('DD.MM.YYYY');
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
      <Paper sx={{ width: '90%', overflow: 'hidden', margin: '0 auto', bgcolor: 'transparent' }}>
        <div className='p-5 text-left'>
          <h4>Willkommen auf der Seite PresseFinder</h4>
          <p>
            Mit unserer Suchfunktion können Sie ganz einfach und schnell mehrere Presseseiten nach relevanten Pressemitteilungen durchsuchen. Mit nur einem Klick erhalten Sie die Ergebnisse, die Sie suchen.
          </p>
          <h5>So funktioniert es</h5>
          <ol>
            <li>Geben Sie einfach einen Suchbegriff in das Suchfeld ein.</li>
            <li>Klicken Sie auf Fälle Suchen, um eine Vielzahl von Presseseiten gleichzeitig zu durchsuchen.</li>            <li>Die Ergebnisse werden in einer übersichtlichen Liste angezeigt, sodass Sie die gefundenen Artikel direkt lesen können.</li>
            <li>Alternativ gibt es auch eine Karte mit Markierungen für die jeweilige Pressemledung.</li>
          </ol>
          <h5>Warum unsere Webseite nutzen?</h5>
          <ul>
            <li><strong>Zeit sparen:</strong> Durchsuchen Sie mehrere Quellen gleichzeitig und sparen Sie wertvolle Zeit.</li>
            <li><strong>Aktuell und relevant:</strong> Finden Sie aktuelle Pressemitteilungen zu Ihren Suchbegriffen.</li>
            <li><strong>Einfach und effizient:</strong> Unsere Suchfunktion ist benutzerfreundlich und liefert Ihnen die gewünschten Informationen schnell und unkompliziert.</li>
          </ul>
          <h5>Unsere Datenquellen</h5>
          <ul>
            <li>presseportal.de</li>
            <li>berlin.de</li>
          </ul>
          <h5>Informationen</h5>
          <ol>
            <li>Die Presseseiten werden direkt nach deiner Anfrage durchsucht, dies kann je nach Ihrem angegebenen Zeitraum der Suche ein wenig Dauern.</li>
            <li>Es ist nicht ausgeschlossen das es zu Duplikaten kommen kann, allerdings werden bereits doppelte Artikelseiten schon rausgefiltert.</li>
          </ol>
        </div>
      </Paper>
    </div>
  );
}

export default Home;