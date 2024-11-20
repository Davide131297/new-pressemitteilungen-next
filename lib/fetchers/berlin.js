import axios from 'axios';
import * as cheerio from 'cheerio';

const convertDateFormat = (date) => {
  const [day, month, year] = date.split('.');
  return `${year}-${month}-${day}`;
};

const fetchArticlesFromBerlin = async (searchtext, startdate, enddate) => {
  const baseURL = 'https://www.berlin.de/presse/pressemitteilungen/index/search';
  const formattedStartDate = convertDateFormat(startdate);
  const formattedEndDate = convertDateFormat(enddate);
  const searchURL = `${baseURL}?searchtext=${encodeURIComponent(searchtext)}&boolean=0&startdate=${formattedStartDate}&enddate=${formattedEndDate}&bt=#searchresults`;

  const results = [];
  try {
    const response = await axios.get(searchURL, { timeout: 10000 });
    const html = response.data;
    const $ = cheerio.load(html);

    const articles = $('tbody tr');
    const articlePromises = [];

    articles.each((index, element) => {
      const date = $(element).find('td').eq(0).text().trim();
      const title = $(element).find('td').eq(1).text().trim();
      const articleLink = $(element).find('td').eq(1).find('a').attr('href');

      if (articleLink) {
        const fullArticleURL = `https://www.berlin.de${articleLink}`;
        results.push({ 
          titel: title, 
          fullArticleURL, 
          date, 
          standort: 'Berlin',
          latitude: 52.5200, 
          longitude: 13.4050,
          source: 'Berlin.de' 
        });
      }
    });

    await Promise.all(articlePromises);

    return results;
  } catch (error) {
    console.error('Error fetching articles from Berlin:', error);
    return [];
  }
};

export { fetchArticlesFromBerlin };