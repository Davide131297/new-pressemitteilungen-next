import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Newspaper,
  BarChart3,
  Clock,
  Target,
  Layers,
  Globe,
  Building,
  TrendingUp,
  Rss,
} from 'lucide-react';
import { TextAnimate } from '@/components/ui/text-animate';

const Welcome = () => {
  return (
    <div className="text-left space-y-6 mt-5">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-8">
        <TextAnimate
          animation="blurIn"
          as="h1"
          className="text-4xl font-bold text-blue-900"
        >
          Willkommen auf der Seite PresseFinder
        </TextAnimate>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          PresseFinder ist dein One-Stop-Tool, um aktuelle Pressemitteilungen,
          die neuesten Nachrichten und Umfrageergebnisse zu finden. Diese
          Plattform bietet dir eine einfache Möglichkeit, schnell und gezielt
          Informationen aus verschiedenen Quellen zu durchsuchen und anzuzeigen.
        </p>
      </div>

      <div className="border-t border-slate-200 my-8"></div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border border-slate-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">News-Seite</h3>
                <p className="text-slate-600">
                  Auf der <strong>News-Seite</strong> findest du eine Übersicht
                  der aktuellsten und wichtigsten Neuigkeiten aus verschiedenen
                  Quellen. Bleibe immer auf dem Laufenden mit relevanten
                  Nachrichten.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Umfrage-Seite</h3>
                <p className="text-slate-600">
                  Interessierst du dich für aktuelle politische Entwicklungen?
                  Unsere <strong>Umfrage-Seite</strong> zeigt dir die neuesten
                  Wahlumfragen und Trends. Perfekt, um politische Stimmungen und
                  Veränderungen nachzuvollziehen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-slate-200 my-8"></div>

      {/* How it works */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-900">
              So funktioniert es
            </h3>
          </div>
          <ol className="space-y-3">
            {[
              'Gib einen Suchbegriff in das Suchfeld ein, um Pressemitteilungen zu durchsuchen.',
              'Besuche die News-Seite, um aktuelle Neuigkeiten aus verschiedenen Kategorien anzuzeigen.',
              'Gehe zur Umfrage-Seite, um die neuesten Wahlumfragen zu analysieren und zu vergleichen.',
              'Nutze Filteroptionen, um die Ergebnisse nach Zeitraum, Quelle oder Relevanz einzugrenzen.',
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-100 text-blue-700 border-blue-300"
                >
                  {index + 1}
                </Badge>
                <span
                  className="text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: step.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong>$1</strong>'
                    ),
                  }}
                />
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="border-t border-slate-200 my-8"></div>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-slate-900">
              Warum PresseFinder nutzen?
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Clock,
                title: 'Zeit sparen',
                desc: 'Alle wichtigen Informationen an einem Ort, ohne zwischen verschiedenen Webseiten wechseln zu müssen.',
              },
              {
                icon: Target,
                title: 'Relevante Ergebnisse',
                desc: 'Ob Pressemitteilungen, Neuigkeiten oder Umfragen – du findest genau, was du suchst.',
              },
              {
                icon: Layers,
                title: 'Vielfältige Informationen',
                desc: 'Diese Plattform kombiniert Nachrichten, Pressemitteilungen und Umfrageergebnisse in einer benutzerfreundlichen Oberfläche.',
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center p-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <benefit.icon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">{benefit.title}</h4>
                <p className="text-sm text-slate-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-slate-200 my-8"></div>

      {/* Data Sources */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-semibold text-slate-900">
              Datenquellen
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: Rss,
                name: 'presseportal.de',
                desc: 'Aktuelle Pressemitteilungen aus ganz Deutschland.',
              },
              {
                icon: Building,
                name: 'berlin.de',
                desc: 'Offizielle Informationen und Mitteilungen der Stadt Berlin.',
              },
              {
                icon: TrendingUp,
                name: 'dawum.de',
                desc: 'Eine Schnittstelle, die die neuesten Umfragen aus verschiedenen Quellen bereitstellt.',
              },
              {
                icon: Globe,
                name: 'mediastack.com',
                desc: 'Eine API für aktuelle Nachrichten aus verschiedenen Quellen.',
              },
            ].map((source, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/50 rounded-lg"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <source.icon className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {source.name}
                  </h4>
                  <p className="text-sm text-slate-600">{source.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-slate-200 my-8"></div>

      {/* Additional Information */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Weitere Informationen
          </h3>
          <div className="space-y-3">
            {[
              'Die Durchsuchung erfolgt in Echtzeit, was bei einer großen Datenmenge ein wenig dauern kann.',
              'Die Algorithmen sind darauf ausgelegt, Duplikate zu vermeiden und dir klare Ergebnisse zu liefern.',
              'Neuigkeiten und Umfragen werden regelmäßig aktualisiert, damit du stets auf dem neuesten Stand bist.',
            ].map((info, index) => (
              <div key={index} className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-amber-100 text-amber-700 border-amber-300"
                >
                  {index + 1}
                </Badge>
                <p className="text-slate-700">{info}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
