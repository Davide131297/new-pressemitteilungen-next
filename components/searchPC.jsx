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
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';

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
  dataSources,
  selectedSources,
  setSelectedSources,
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

      <FormControl
        sx={{
          minWidth: 100,
          marginBottom: 2,
          marginRight: 2,
          height: '56px',
          maxWidth: '200px',
          marginLeft: '5px',
        }}
      >
        <InputLabel id="data-source-label">Datenquelle</InputLabel>
        <Select
          labelId="data-source-label"
          multiple
          value={selectedSources}
          onChange={(e) => setSelectedSources(e.target.value)}
          input={
            <OutlinedInput
              label="Datenquelle"
              sx={{ height: '56px', alignItems: 'center', display: 'flex' }}
            />
          }
          renderValue={(selected) =>
            selected.length === dataSources.length
              ? 'Alle'
              : dataSources
                  .filter((ds) => selected.includes(ds.value))
                  .map((ds) => ds.label)
                  .join(', ')
          }
          size="small"
          sx={{ height: '56px', display: 'flex', alignItems: 'center' }}
        >
          {dataSources.map((source) => (
            <MenuItem key={source.value} value={source.value}>
              <Checkbox checked={selectedSources.indexOf(source.value) > -1} />
              <ListItemText primary={source.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
