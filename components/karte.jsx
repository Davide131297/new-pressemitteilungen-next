import React, { useState, useEffect } from 'react';
import KarteDeutschland from '../assets/Karte_Deutschland_New.svg';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Image from 'next/image';
import sendLogs from '@/lib/sendLogs';

function convertGeoToPixel(latitude, longitude, mapWidth, mapHeight) {
  const minLat = 47.2701114;
  const maxLat = 55.05814;
  const minLng = 5.8663425;
  const maxLng = 15.0419319;

  const x = ((longitude - minLng) / (maxLng - minLng)) * mapWidth;
  const y = ((maxLat - latitude) / (maxLat - minLat)) * mapHeight;

  return { x, y };
}

function groupDataByLocation(data) {
  return data.reduce((acc, item) => {
    const key = item.standort; // Gruppiere nach dem Attribut "standort"
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

export default function Karte({ data }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStandorte, setSelectedStandorte] = useState([]);
  const [mapDimensions, setMapDimensions] = useState({
    width: 350,
    height: 'calc(100vh - 300px)',
  });
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const newHeight = isMobile
        ? window.innerHeight * 0.9 - 200
        : window.innerHeight - 300;
      const newWidth = (newHeight / 472.5) * 350;
      setMapDimensions({ width: newWidth, height: newHeight });
    };

    handleResize(); // Initial festlegen
    window.addEventListener('resize', handleResize); // Bei Fensteränderung anpassen

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMarkerClick = (event, standorte) => {
    sendLogs(
      'info',
      `Marker clicked: ${standorte[0].standort}`,
      'map-clicked',
      `${standorte[0].standort}`,
      `${standorte[0].bundesland}`
    );
    setAnchorEl(event.currentTarget);
    setSelectedStandorte(standorte);
    setTabIndex(0);
  };

  const handleCloseTooltip = (event) => {
    if (anchorEl && anchorEl.contains(event.target)) {
      return;
    }
    setAnchorEl(null);
    setSelectedStandorte([]);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const groupedData = groupDataByLocation(data);

  return (
    <Box
      sx={{
        position: 'relative',
        width: `${mapDimensions.width}px`,
        height: `${mapDimensions.height}px`,
        margin: '0 auto',
      }}
      onClick={handleCloseTooltip}
    >
      <Image
        src={KarteDeutschland}
        alt="Karte"
        width={'100%'}
        height={'100%'}
      />
      {Object.keys(groupedData).map((key, index) => {
        const standorte = groupedData[key];
        const latitude = parseFloat(standorte[0].latitude);
        const longitude = parseFloat(standorte[0].longitude);
        if (isNaN(latitude) || isNaN(longitude)) {
          return null;
        }
        const { x, y } = convertGeoToPixel(
          latitude,
          longitude,
          mapDimensions.width,
          mapDimensions.height
        );

        const meldung = standorte.length === 1 ? 'Meldung' : 'Meldungen';
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${y}px`,
              left: `${x}px`,
              width: '10px',
              height: '10px',
              backgroundColor: 'red',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 2,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkerClick(e, standorte);
            }}
            title={`${standorte[0].standort} - ${standorte.length} ${meldung}`}
          />
        );
      })}
      {selectedStandorte.length > 0 && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseTooltip}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <div
            style={{ padding: '16px', maxWidth: '50vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="Standorte Tabs"
                orientation="horizontal"
                variant="scrollable"
                scrollButtons="auto"
              >
                {selectedStandorte.map((standort, index) => (
                  <Tab key={index} label={`Fall ${index + 1}`} />
                ))}
              </Tabs>
            </div>
            {selectedStandorte.map((standort, index) => (
              <div
                key={index}
                role="tabpanel"
                hidden={tabIndex !== index}
                style={{ marginTop: '16px' }}
              >
                {tabIndex === index && (
                  <>
                    <Typography variant="h6">{standort.titel}</Typography>
                    <Typography variant="body2">{standort.standort}</Typography>
                    <Typography variant="body2">{standort.date}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      href={standort.fullArticleURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginTop: '8px' }}
                    >
                      Zum Artikel
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </Popover>
      )}
    </Box>
  );
}
