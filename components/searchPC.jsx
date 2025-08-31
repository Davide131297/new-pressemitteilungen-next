import {
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { red } from '@mui/material/colors';

const SearchPC = ({
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
  handleStopSearch,
}) => {
  return (
    <Box
      sx={{
        marginTop: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'fit-content',
      }}
    >
      <TextField
        label="Suchbegriff"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="formControl"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <DatePicker
          label="Startdatum wählen"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          textField={(params) => <TextField {...params} fullWidth />}
          inputFormat="DD.MM.YYYY"
          format="DD.MM.YYYY"
          sx={{ marginLeft: '5px' }}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <DatePicker
          label="Enddatum wählen"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          textField={(params) => <TextField {...params} fullWidth />}
          inputFormat="DD.MM.YYYY"
          format="DD.MM.YYYY"
          sx={{ marginLeft: '5px' }}
        />
      </LocalizationProvider>

      <Button
        variant="outlined"
        onClick={() => handleApiCall('desktop')}
        disabled={loading}
        sx={{
          marginLeft: '5px',
          marginRight: '5px',
          borderColor: 'grey.500',
          color: 'black',
          '&:hover': {
            borderColor: 'grey.700',
            backgroundColor: 'transparent',
          },
          padding: '10px 20px',
          borderRadius: '4px',
          height: '56px',
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={24} />
            <Box ml={1}>Suche..</Box>
          </>
        ) : (
          'Fälle Suchen'
        )}
      </Button>
      {loading && (
        <Tooltip title="Suche abbrechen">
          <IconButton
            aria-label="delete"
            size="large"
            onClick={handleStopSearch}
            color="error"
          >
            <StopCircleIcon fontSize="inherit" sx={{ color: red }} />
          </IconButton>
        </Tooltip>
      )}
      {elapsedTime !== null && (
        <Box ml={2}>
          Dauer der Suche: {Math.floor(elapsedTime / 60)} Minuten{' '}
          {Math.floor(elapsedTime % 60)} Sekunden - Anzahl der Ergebnisse:{' '}
          {data.length}
        </Box>
      )}
    </Box>
  );
};
export default SearchPC;
