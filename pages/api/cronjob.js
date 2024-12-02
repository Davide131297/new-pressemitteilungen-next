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

async function saveToDatabase(data) {
    try {
        const client = await getDbClient();
        const database = client.db('Pressemitteilungen');
        const collection = database.collection('News.API');

        const result = await collection.insertMany(data.articles);
        console.log(`${result.insertedCount} Dokumente wurden eingefügt`);
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
    }
}

cron.schedule('53 18 * * *', async () => {
    try {
        const startDate = new Date('2024-11-30');
        const endDate = new Date('2024-11-30');
        const apiUrl = `https://newsapi.org/v2/everything?domains=tagesspiegel.de,zeit.de,handelsblatt.com,spiegel.de&apiKey=${apiKey}&from=${startDate}&to=${endDate}&sortBy=popularity`;

        console.log('API-URL:', apiUrl);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API Fehler: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        await saveToDatabase(data);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}, {
    scheduled: true,
    timezone: "Europe/Berlin"
});



console.log('Cron-Job gestartet');