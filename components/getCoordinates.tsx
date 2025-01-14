import axios from 'axios';

export const cleanLocation = (location: string) => {
  if (location.includes('Landkreise')) {
    const match = location.match(/Landkreise\s+(\w+)/);
    if (match) {
      return match[1];
    }
  }

  const cleanedLocation = location.split(/[,|\/|-]/)[0].trim();
  if (location.includes('Frankfurt/Main')) {
    return 'Frankfurt am Main';
  }
  return cleanedLocation;
};

export const getCoordinates = async (location: string) => {
  try {
    const cleanedLocation = cleanLocation(location);
    const res = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search`,
      {
        params: {
          name: cleanedLocation,
          count: 10,
          language: 'de',
          format: 'json',
        },
      }
    );

    if (res.data && res.data.results) {
      const germanLocations = res.data.results.filter(
        (loc: { country_code: string }) => loc.country_code === 'DE'
      );
      if (germanLocations.length > 0) {
        return {
          latitude: germanLocations[0].latitude,
          longitude: germanLocations[0].longitude,
          bundesland: germanLocations[0].admin1,
        };
      }
    }
    return {
      latitude: null,
      longitude: null,
      bundesland: null,
    };
  } catch (error) {
    console.error(`Error geocoding location ${location}:`, error);
    return {
      latitude: null,
      longitude: null,
      bundesland: null,
    };
  }
};
