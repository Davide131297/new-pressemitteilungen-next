import { MongoClient } from 'mongodb';

let dbClient = null;

async function getDbClient() {
  if (!dbClient) {
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.4k82o.mongodb.net/?retryWrites=true&w=majority`;
    console.log('Datenbank-URI:', uri);
    try {
      dbClient = new MongoClient(uri);
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

    if (collectionName === 'newsmediastack') {
      dbCollection = database.collection('News.Mediastack');
      if (data.articles && data.articles.length > 0) {
        const result = await dbCollection.insertMany(data.data);
        console.log(`${result.insertedCount} Dokumente wurden eingefügt`);
      } else {
        console.log('Keine Artikel zum Einfügen');
      }
    }
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
}

async function fetchNewsMediaStack(apiKey, keywords) {
  const apiUrl = `http://api.mediastack.com/v1/news?access_key=${apiKey}&languages=de&keywords=${keywords}`;
  console.log('API-URL:', apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  await saveToDatabase('newsmediastack', data);
}

async function fetchData(apiKey, startDate, endDate) {
  await Promise.all([fetchNewsMediaStack(apiKey, startDate, endDate)]);
}

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_MEDIASTACK_KEY;
  const keywords = 'spd,cdu,csu,grünen,linke,fdp,bsw,afd';

  console.log('ApiKey:', apiKey);

  if (!apiKey) {
    res.status(500).json({ error: 'NEWS_MEDIASTACK_KEY ist nicht definiert' });
    return;
  }

  try {
    await fetchData(apiKey, keywords);
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
