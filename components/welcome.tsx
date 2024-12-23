import Paper from '@mui/material/Paper';

const Welcome = () => {
  return (
    <Paper className="w-11/12 mx-auto bg-transparent p-5">
      <div className="text-left space-y-4">
        <h4 className="text-2xl font-bold">
          Willkommen auf der Seite PresseFinder
        </h4>
        <p className="text-lg">
          PresseFinder ist dein One-Stop-Tool, um aktuelle Pressemitteilungen,
          die neuesten Nachrichten und Umfrageergebnisse zu finden. Diese
          Plattform bietet dir eine einfache Möglichkeit, schnell und gezielt
          Informationen aus verschiedenen Quellen zu durchsuchen und anzuzeigen.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>News-Seite:</strong> Auf der <strong>News-Seite</strong>{' '}
            findest du eine Übersicht der aktuellsten und wichtigsten
            Neuigkeiten aus verschiedenen Quellen. Bleibe immer auf dem
            Laufenden mit relevanten Nachrichten.
          </li>
          <li>
            <strong>Umfrage-Seite:</strong> Interessierst du dich für aktuelle
            politische Entwicklungen? Unsere <strong>Umfrage-Seite</strong>{' '}
            zeigt dir die neuesten Wahlumfragen und Trends. Perfekt, um
            politische Stimmungen und Veränderungen nachzuvollziehen.
          </li>
        </ul>
        <h5 className="text-xl font-semibold">So funktioniert es</h5>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Gib einen Suchbegriff in das Suchfeld ein, um Pressemitteilungen zu
            durchsuchen.
          </li>
          <li>
            Besuche die <strong>News-Seite</strong>, um aktuelle Neuigkeiten aus
            verschiedenen Kategorien anzuzeigen.
          </li>
          <li>
            Gehe zur <strong>Umfrage-Seite</strong>, um die neuesten
            Wahlumfragen zu analysieren und zu vergleichen.
          </li>
          <li>
            Nutze Filteroptionen, um die Ergebnisse nach Zeitraum, Quelle oder
            Relevanz einzugrenzen.
          </li>
        </ol>
        <h5 className="text-xl font-semibold">Warum PresseFinder nutzen?</h5>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Zeit sparen:</strong> Alle wichtigen Informationen an einem
            Ort, ohne zwischen verschiedenen Webseiten wechseln zu müssen.
          </li>
          <li>
            <strong>Relevante Ergebnisse:</strong> Ob Pressemitteilungen,
            Neuigkeiten oder Umfragen – du findest genau, was du suchst.
          </li>
          <li>
            <strong>Vielfältige Informationen:</strong> Diese Plattform
            kombiniert Nachrichten, Pressemitteilungen und Umfrageergebnisse in
            einer benutzerfreundlichen Oberfläche.
          </li>
        </ul>
        <h5 className="text-xl font-semibold">Unsere Datenquellen</h5>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>presseportal.de:</strong> Aktuelle Pressemitteilungen aus
            ganz Deutschland.
          </li>
          <li>
            <strong>berlin.de:</strong> Offizielle Informationen und
            Mitteilungen der Stadt Berlin.
          </li>
          <li>
            <strong>dawum.de:</strong> Eine Schnittstelle, die die neuesten
            Umfragen aus verschiedenen Quellen bereitstellt.
          </li>
          <li>
            <strong>mediastack.com</strong>: Eine API für aktuelle Nachrichten
            aus verschiedenen Quellen.
          </li>
        </ul>
        <h5 className="text-xl font-semibold">Weitere Informationen</h5>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Die Durchsuchung erfolgt in Echtzeit, was bei einer großen
            Datenmenge ein wenig dauern kann.
          </li>
          <li>
            Die Algorithmen sind darauf ausgelegt, Duplikate zu vermeiden und
            dir klare Ergebnisse zu liefern.
          </li>
          <li>
            Neuigkeiten und Umfragen werden regelmäßig aktualisiert, damit du
            stets auf dem neuesten Stand bist.
          </li>
        </ol>
        {/*
        <h5 className="text-xl font-semibold">Kontaktiere uns</h5>
        <p className="text-lg">
          Hast du Fragen, Feedback oder Verbesserungsvorschläge? Wir freuen uns,
          von dir zu hören! Schreibe uns eine E-Mail an{' '}
          <a
            href="mailto:support@pressefinder.de"
            className="text-blue-600 underline"
          >
            support@pressefinder.de
          </a>
          .
        </p>
        */}
      </div>
    </Paper>
  );
};

export default Welcome;
