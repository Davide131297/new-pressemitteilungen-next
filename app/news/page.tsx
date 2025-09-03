'use client';

import { useEffect, useState } from 'react';
import NewsContent from '@/components/newsContent';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { NewsItem } from '@/components/myInterfaces';

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Basisnachrichten laden beim ersten Render
    fetch('/api/news')
      .then((response) => response.json())
      .then((data) => {
        setNewsData(data);
      })
      .catch((error) => {
        console.error('Fehler beim Laden der Basisnachrichten:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleOnClick() {
    if (searchTerm.trim() === '') {
      setAlertMessage('Bitte geben Sie einen Suchbegriff ein.');
      setOpen(true);
      return;
    }
    setLoading(true);
    fetch(`/api/news/search?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setNewsData(data.response.articles);
      })
      .catch(() => {
        setAlertMessage('Fehler beim Suchen der Nachrichten');
        setOpen(true);
      })
      .finally(() => setLoading(false));
  }

  const handleClose = () => {
    setOpen(false);
    setAlertMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      <main className="container mx-auto px-4 py-8 flex flex-col gap-5">
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="search-input">Suchen</InputLabel>
          <OutlinedInput
            id="search-input"
            label="Suchen"
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon
                  onClick={handleOnClick}
                  className="cursor-pointer"
                />
              </InputAdornment>
            }
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </FormControl>
        <NewsContent newsData={newsData} loading={loading} />
      </main>
    </div>
  );
}
