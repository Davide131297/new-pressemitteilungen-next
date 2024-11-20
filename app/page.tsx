'use client'

import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import axios from 'axios';
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
import Datenschutz from '../components/datenschutz';

function Home() {
  const [query, setQuery] = useState('Messer');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const matches = useMediaQuery('(max-width:600px)');
  const [openImpressum, setOpenImpressum] = useState(false);
  const [openDatenschutz, setOpenDatenschutz] = useState(false);

  useEffect(() => {
    handleApiCall();
  }, []);

  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

  const handleApiCall = async () => {
    if (startDate && endDate) {
      setLoading(true);
      const startTime = Date.now();
      const formattedStartDate = dayjs(startDate).format('DD.MM.YYYY');
      const formattedEndDate = dayjs(endDate).format('DD.MM.YYYY');
      const apiUrl = `http://192.168.0.20:3002/api/articles?query=${query}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
        setPage(0); // Reset to first page on new data fetch
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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleOpenImpressum = () => {
    setOpenImpressum(true);
  };

  const handleCloseImpressum = () => {
    setOpenImpressum(false);
  };

  const handleOpenDatenschutz = () => {
    setOpenDatenschutz(true);
  };

  const handleCloseDatenschutz = () => {
    setOpenDatenschutz(false);
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
          isMobile={matches}
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
          <h5>So funktioniert's</h5>
          <ol>
            <li>Geben Sie einfach einen Suchbegriff in das Suchfeld ein.</li>
            <li>Klicken Sie auf "Fälle Suchen", um eine Vielzahl von Presseseiten gleichzeitig zu durchsuchen.</li>
            <li>Die Ergebnisse werden in einer übersichtlichen Liste angezeigt, sodass Sie die gefundenen Artikel direkt lesen können.</li>
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
          backgroundColor: 'rgb(200, 200, 200)',
          color: 'white',
          width: '100%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={{ cursor: 'pointer', marginRight: '10px', color: 'black' }}
          onClick={handleOpenImpressum}
        >
          Impressum
        </Typography>
        <Typography
          sx={{ cursor: 'pointer' }}
          onClick={handleOpenDatenschutz}
          color='black'
        >
          Datenschutz
        </Typography>

        <Dialog open={openImpressum} onClose={handleCloseImpressum}>
          <DialogTitle>Impressum</DialogTitle>
          <DialogContent>
            <Typography>Hier steht das Impressum.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImpressum}>Schließen</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDatenschutz} onClose={handleCloseDatenschutz}>
          <DialogTitle>Datenschutz</DialogTitle>
          <DialogContent>
            <Typography>
              <Datenschutz />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDatenschutz}>Schließen</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

export default Home;