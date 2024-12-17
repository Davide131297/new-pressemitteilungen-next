import cron from 'node-cron';
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.4k82o.mongodb.net/?retryWrites=true&w=majority;`;
const apiKey = process.env.NEWS_API_KEY;
let dbClient;

async function getDbClient() {
  if (!dbClient) {
    try {
      dbClient = new MongoClient(uri);
      await dbClient.connect();
      console.log('Datenbank-Verbindung hergestellt');
    } catch (error) {
      console.error('Fehler beim Herstellen der Datenbank-Verbindung:', error);
    }
    return dbClient;
  }
}

async function saveToDatabase(collection, data) {
  try {
    const client = await getDbClient();
    const database = client.db('Pressemitteilungen');
    let dbCollection;

    if (collection === 'newsapi') {
      dbCollection = database.collection('News.API');
      const result = await dbCollection.insertMany(data.articles);
      console.log(`${result.insertedCount} Dokumente wurden eingefügt`);
    } else if (collection === 'newsdata') {
      dbCollection = database.collection('News.DATA');
      const result = await dbCollection.insertMany(data.results);
      console.log(`${result.totalResults} Dokumente wurden eingefügt`);
    } else {
      throw new Error('Ungültige Sammlung');
    }
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
}

cron.schedule(
  // NEWSAPI
  '51 16 * * *',
  async () => {
    const datasource = 'newsapi';
    try {
      const startDate = new Date();
      const endDate = new Date();
      const apiUrl = `https://newsapi.org/v2/everything?domains=tagesspiegel.de,zeit.de,handelsblatt.com,spiegel.de&apiKey=${apiKey}&from=${startDate}&to=${endDate}&sortBy=publishedAt`;

      console.log('API-URL:', apiUrl);
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(
          `API Fehler: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      await saveToDatabase(datasource, data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  },
  {
    scheduled: true,
    timezone: 'Europe/Berlin',
  }
);

cron.schedule(
  //NewsDATA
  '50 17 * * *',
  async () => {
    const datasource = 'newsdata';
    try {
      const apiUrl = `https://newsdata.io/api/1/latest?apikey=pub_6098201d1e4ef7697cc5510571b9bf77223cc&language=de&country=de&category=politics`;

      console.log('API-URL:', apiUrl);
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(
          `API Fehler: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Daten: ', data);
      await saveToDatabase(datasource, data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  },
  {
    scheduled: true,
    timezone: 'Europe/Berlin',
  }
);

console.log('Cron-Job gestartet');
