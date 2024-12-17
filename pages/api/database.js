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

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await getDbClient();
    const db = client.db('Pressemitteilungen');
    await db.dropDatabase();
    res.status(200).json({ message: 'Datenbank erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen der Datenbank:', error);
    res.status(500).json({ message: 'Fehler beim Löschen der Datenbank' });
  }
}
