import { TextField, Button, Box, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';

const SearchMobile = ({
  query,
  setQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleApiCall,
  loading,
  elapsedTime,
  data,
}) => {
  return (
    <Box
      sx={{
        marginTop: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <TextField
        label="Suchbegriff"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="formControl"
        sx={{ width: '300px', marginBottom: '20px' }}
      />
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '20px',
          width: '300px',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
          <DatePicker
            label="Startdatum wählen"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            textField={(params) => (
              <TextField {...params} sx={{ width: '100%' }} />
            )}
            inputFormat="DD.MM.YYYY"
            format="DD.MM.YYYY"
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
          <DatePicker
            label="Enddatum wählen"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            textField={(params) => (
              <TextField {...params} sx={{ width: '100%' }} />
            )}
            inputFormat="DD.MM.YYYY"
            format="DD.MM.YYYY"
          />
        </LocalizationProvider>
      </Box>
      <Button
        variant="outlined"
        onClick={() => handleApiCall('mobile')}
        disabled={loading}
        sx={{
          borderColor: 'grey.500',
          color: 'black',
          '&:hover': {
            borderColor: 'grey.700',
            backgroundColor: 'transparent',
          },
          padding: '10px 20px',
          borderRadius: '4px',
          height: '56px',
          width: '300px',
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={24} />
            <Box ml={1}>Suche...</Box>
          </>
        ) : (
          'Fälle Suchen'
        )}
      </Button>
      {elapsedTime !== null && (
        <Box mt={2} style={{ fontSize: '0.7em' }}>
          Dauer der Suche: {Math.floor(elapsedTime / 60)} Minuten{' '}
          {Math.floor(elapsedTime % 60)} Sekunden - Anzahl der Ergebnisse:{' '}
          {data.length}
        </Box>
      )}
    </Box>
  );
};
export default SearchMobile;
