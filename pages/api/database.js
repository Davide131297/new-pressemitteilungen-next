import { getDbClient } from './database';

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
