import { NextApiRequest, NextApiResponse } from 'next';
import { getDbClient } from '../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { collectionName, data } = req.body;
    try {
      const client = await getDbClient();
      const database = client.db('Pressemitteilungen');
      const collection = database.collection(collectionName);
      const result = await collection.insertOne(data);
      console.log('Daten erfolgreich gespeichert:', result);
      res
        .status(200)
        .json({ message: 'Daten erfolgreich gespeichert', result });
    } catch (error) {
      console.error('Keine Datenbank-Verbindung vorhanden', error);
      res
        .status(500)
        .json({ message: 'Fehler beim Speichern der Daten', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
