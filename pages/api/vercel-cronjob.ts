export default function handler(req, res) {
  const startDate = new Date();
  const endDate = new Date();
  const apiKey = process.env.NEWS_API_KEY;

  if (apiKey !== undefined) {
    try {
      // Stellen Sie sicher, dass Ihr API-Schlüssel in den Umgebungsvariablen gespeichert ist
      const apiUrl = `https://newsapi.org/v2/everything?domains=tagesspiegel.de,zeit.de,handelsblatt.com,spiegel.de&apiKey=${apiKey}&from=${startDate.toISOString()}&to=${endDate.toISOString()}&sortBy=publishedAt`;

      // Führen Sie Ihre API-Anfrage oder andere Logik hier aus
      console.log(`API URL: ${apiUrl}`);

      res.status(200).json({ message: 'Cron-Job ausgeführt' });
    } catch (error) {
      console.error('Fehler beim Ausführen des Cron-Jobs:', error);
      res.status(500).json({ error: 'Fehler beim Ausführen des Cron-Jobs' });
    }
  }
}
