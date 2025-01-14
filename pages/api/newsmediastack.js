import { getDbClient } from '../../lib/database';

async function saveToDatabase(collectionName, data) {
  try {
    const client = await getDbClient();
    const database = client.db('Pressemitteilungen');
    let dbCollection;

    if (collectionName === 'newsmediastack') {
      dbCollection = database.collection('News.Mediastack');
      if (data.data && data.data.length > 0) {
        const seenTitles = new Set();
        const filteredData = data.data.filter((item) => {
          const isValidSource =
            item.source !== 'jungewelt' && // Vom Verfassungsschutz beobachtet
            item.source !== 'aktiencheck' && // Nicht relevant
            item.source !== 'finanznachrichten' && // Nicht relevant
            item.source !== 'stocks' && // Nicht relevant
            item.source !== 'jungefreiheit' && // Rechtsextrem
            item.source !== 'mobil' && // Nicht relevant
            item.source !== 'fehmarn24' && // Nicht relevant
            item.source !== 'Hamburger Abendblatt' && // Nicht relevant
            item.source !== 'golem' && // Nicht relevant
            item.source !== 'ots' && // Nicht relevant
            item.source !== 'main-netz' && // Nicht relevant
            item.source !== 'Krone.at' && // Nicht relevant
            item.source !== 'rf-news' && // Nicht relevant
            item.source !== 'epochtimes' && // Nicht relevant
            item.source !== 'wort' && // Nicht relevant
            item.source !== '"op-online"' && // Nicht relevant
            item.source !== 'kreiszeitung' && // Nicht relevant
            item.source !== 'business-panorama' && // Nicht relevant
            !item.url.includes('.ch'); // Schweizer Internetseiten
          const isUniqueTitle = !seenTitles.has(item.title);
          if (isValidSource && isUniqueTitle) {
            seenTitles.add(item.title);
            return true;
          }
          return false;
        });

        if (filteredData.length > 0) {
          const result = await dbCollection.insertMany(filteredData);
          console.log(`${result.insertedCount} Dokumente wurden eingefügt`);
        } else {
          console.log('Keine Artikel zum Einfügen');
        }
      } else {
        console.log('Keine Artikel zum Einfügen');
      }
    }
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
}

async function fetchNewsMediaStack(apiKey, keywords) {
  const apiUrl = `http://api.mediastack.com/v1/news?access_key=${apiKey}&languages=de&keywords=${keywords}&limit=100`;
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
