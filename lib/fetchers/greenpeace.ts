import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse, format } from 'date-fns';

const fetchArticlesFromGreenpeace = async (
  searchtext: string,
  startDate: string,
  endDate: string
) => {
  const baseURL = `https://presseportal.greenpeace.de/search/press_releases/?q=${searchtext}`;
  const response = await axios.get(baseURL);
  const html = response.data;
  const $ = cheerio.load(html);

  const articles: {
    titel: string;
    date: string;
    fullArticleURL: string;
    standort: string;
  }[] = [];

  $('.article__item').each((_, el) => {
    const date = $(el).find('time.c-card__time').attr('datetime') || '';
    let formattedDate = '';
    if (date) {
      formattedDate = format(
        parse(date, 'yyyy-MM-dd', new Date()),
        'dd.MM.yyyy'
      );
    }
    const titel = $(el).find('h3.article__title a').text().trim();
    const relativeUrl = $(el).find('a.article__img-holder').attr('href') || '';
    const fullArticleURL = relativeUrl
      ? `https://presseportal.greenpeace.de${relativeUrl}`
      : '';

    if (formattedDate) {
      const articleDate = parse(formattedDate, 'dd.MM.yyyy', new Date());
      const start = parse(startDate, 'dd.MM.yyyy', new Date());
      const end = parse(endDate, 'dd.MM.yyyy', new Date());
      if (articleDate >= start && articleDate <= end) {
        articles.push({
          titel,
          date: formattedDate,
          fullArticleURL,
          standort: 'Ohne Angabe',
        });
      }
    }
  });

  return articles;
};

export { fetchArticlesFromGreenpeace };
