import { MongoClient } from 'mongodb';

let dbClient = null;

async function getDbClient() {
  if (!dbClient) {
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.4k82o.mongodb.net/?retryWrites=true&w=majority`;
    try {
      dbClient = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await dbClient.connect();
      console.log('Datenbank-Verbindung hergestellt');
    } catch (error) {
      console.error('Fehler beim Herstellen der Datenbank-Verbindung:', error);
      throw new Error('Datenbank-Verbindung fehlgeschlagen');
    }
  }
  return dbClient;
}

async function saveToDatabase(collectionName, data) {
  try {
    const client = await getDbClient();
    const database = client.db('Pressemitteilungen');
    let dbCollection;

    if (collectionName === 'newsdata') {
      dbCollection = database.collection('News.DATA');
      if (data.results && data.results.length > 0) {
        const result = await dbCollection.insertMany(data.results);
        console.log(`${result.insertedCount} Dokumente wurden eingefügt`);
      } else {
        console.log('Keine Ergebnisse zum Einfügen');
      }
    } else {
      throw new Error('Ungültige Sammlung');
    }
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
}

async function fetchNewsData() {
  const apiUrl = `https://newsdata.io/api/1/latest?apikey=pub_6098201d1e4ef7697cc5510571b9bf77223cc&language=de&country=de&category=politics`;
  console.log('API-URL:', apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  await saveToDatabase('newsdata', data);
}

async function fetchData() {
  await Promise.all([fetchNewsData()]);
}

export default async function handler(req, res) {
  try {
    await fetchData();
    res
      .status(200)
      .json({ message: 'Daten erfolgreich abgerufen und gespeichert' });
  } catch (error) {
    console.error('Fehler beim Abrufen und Speichern der Daten:', error);
    res
      .status(500)
      .json({ error: 'Fehler beim Abrufen und Speichern der Daten' });
  }
}
