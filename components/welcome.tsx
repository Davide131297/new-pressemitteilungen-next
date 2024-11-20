import Paper from '@mui/material/Paper';

const Welcome = () => {
    return (
        <Paper className="w-11/12 mx-auto bg-transparent p-5">
            <div className="text-left space-y-4">
                <h4 className="text-2xl font-bold">Willkommen auf der Seite PresseFinder</h4>
                <p className="text-lg">
                    Mit der Suchfunktion kannst du ganz einfach und schnell mehrere Presseseiten nach relevanten Pressemitteilungen durchsuchen. Mit nur einem Klick erhältst du die Ergebnisse, die du suchst.
                </p>
                <h5 className="text-xl font-semibold">So funktioniert es</h5>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Gib einfach einen Suchbegriff in das Suchfeld ein.</li>
                    <li>Klicke auf Fälle Suchen, um eine Vielzahl von Presseseiten gleichzeitig zu durchsuchen.</li>
                    <li>Die Ergebnisse werden in einer übersichtlichen Liste angezeigt, sodass du die gefundenen Artikel direkt lesen kannst.</li>
                    <li>Alternativ gibt es auch eine Karte mit Markierungen für die jeweilige Pressemeldung.</li>
                </ol>
                {/*
                <h5 className="text-xl font-semibold">Warum unsere Webseite nutzen?</h5>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Zeit sparen:</strong> Durchsuche mehrere Quellen gleichzeitig und spare wertvolle Zeit.</li>
                    <li><strong>Aktuell und relevant:</strong> Finde aktuelle Pressemitteilungen zu deinen Suchbegriffen.</li>
                    <li><strong>Einfach und effizient:</strong> Unsere Suchfunktion ist benutzerfreundlich und liefert dir die gewünschten Informationen schnell und unkompliziert.</li>
                </ul>
                */}
                <h5 className="text-xl font-semibold">Datenquellen</h5>
                <ul className="list-disc list-inside space-y-2">
                    <li>presseportal.de</li>
                    <li>berlin.de</li>
                </ul>
                <h5 className="text-xl font-semibold">Informationen</h5>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Die Presseseiten werden direkt nach deiner Anfrage durchsucht, dies kann je nach deinem angegebenen Zeitraum der Suche ein wenig dauern.</li>
                    <li>Es ist nicht ausgeschlossen, dass es zu Duplikaten kommen kann, allerdings werden bereits doppelte Artikelseiten schon rausgefiltert.</li>
                </ol>
            </div>
        </Paper>
    );
};

export default Welcome;