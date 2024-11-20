import axios from 'axios';
import * as cheerio from 'cheerio';

const getCoordinates = async (location) => {
  try {
    const cleanedLocation = cleanLocation(location);
    const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
      params: {
        name: cleanedLocation,
        count: 10,
        language: 'de',
        format: 'json'
      }
    });

    if (res.data && res.data.results) {
      const germanLocations = res.data.results.filter(loc => loc.country_code === 'DE');
      if (germanLocations.length > 0) {
        return {
          latitude: germanLocations[0].latitude,
          longitude: germanLocations[0].longitude,
          bundesland: germanLocations[0].admin1 // Bundesland hinzufügen
        };
      }
    }
    return {
      latitude: null,
      longitude: null,
      bundesland: null
    };
  } catch (error) {
    console.error(`Error geocoding location ${location}:`, error);
    return {
      latitude: null,
      longitude: null,
      bundesland: null
    };
  }
};

const cleanLocation = (location) => {
  if (location.includes("Landkreise")) {
    const match = location.match(/Landkreise\s+(\w+)/);
    if (match) {
      return match[1];
    }
  }
  
  const cleanedLocation = location.split(/[,|\/|-]/)[0].trim();
  if (location.includes("Frankfurt/Main")) {
    return "Frankfurt am Main";
  }
  return cleanedLocation;
};

const fixUglyUrl = (uglyUrl) => {
  return uglyUrl.replace(/@/g, '/');
};

const convertDateFormat = (date) => {
  const [day, month, year] = date.split('.');
  return `${year}-${month}-${day}`;
};

const fetchFullArticle = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 10000 }); // Timeout auf 10 Sekunden erhöhen
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract the location from the meta tag
    const metaDescription = $('meta[name="og:description"]').attr('content');
    const locationMatch = metaDescription ? metaDescription.split(' (ots)')[0] : 'Unbekannt';
    const standort = locationMatch.trim();

    const { latitude, longitude, bundesland } = await getCoordinates(standort);

    return { standort: cleanLocation(standort), latitude, longitude, bundesland };
  } catch (error) {
    console.error(`Error fetching article ${url}:`, error);
    return { standort: 'Unbekannt', latitude: null, longitude: null, bundesland: null };
  }
};

const fetchArticlesFromPresseportal = async (query, startDate, endDate) => {
  const baseURL = 'https://www.presseportal.de';
  const formattedStartDate = convertDateFormat(startDate);
  const formattedEndDate = convertDateFormat(endDate);
  let offset = 0;

  const ergebnisse = [];
  try {
    const fetchPage = async (url) => {
      const antwort = await axios.get(url, { timeout: 10000 }); // Timeout auf 10 Sekunden erhöhen
      const html = antwort.data;
      const $ = cheerio.load(html);

      const artikelAufSeite = $('.article-list li');
      const artikelVersprechen = [];

      artikelAufSeite.each((index, element) => {
        const titel = $(element).find('.news-headline-clamp').text().trim();
        const haesslicheUrl = $(element).find('.news-morelink').attr('data-url-ugly');
        const datum = $(element).find('.news-meta .date').text().trim().split(' – ')[0]; // Nur das Datum extrahieren

        if (haesslicheUrl) {
          const artikelLink = fixUglyUrl(haesslicheUrl);
          const urlPath = new URL(artikelLink).pathname.split('/')[1];
          if (urlPath === 'blaulicht') {
            artikelVersprechen.push(
              fetchFullArticle(artikelLink).then(({ standort, latitude, longitude, bundesland }) => {
                ergebnisse.push({ 
                  titel, 
                  fullArticleURL: artikelLink, 
                  date: datum, 
                  standort, 
                  latitude, 
                  longitude, 
                  bundesland, // Bundesland hinzufügen
                  source: 'Presseportal.de' 
                });
              })
            );
          }
        }
      });

      await Promise.all(artikelVersprechen);

      const artikelAnzahl = parseInt($('.filter-storycount').text().split(' ')[0]);
      if (artikelAnzahl > ergebnisse.length) {
        offset += 30;
        const nextPageUrl = `${baseURL}/suche/${encodeURIComponent(query)}/blaulicht/${offset}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
        await fetchPage(nextPageUrl);
      }
    };

    const initialURL = `${baseURL}/suche/${encodeURIComponent(query)}/blaulicht/${offset}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    await fetchPage(initialURL);

    return ergebnisse;
  } catch (error) {
    console.error('Fehler beim Abrufen der Webseite:', error);
    return [];
  }
};

export { fetchArticlesFromPresseportal };