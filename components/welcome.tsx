import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Layers, Globe } from 'lucide-react';
import { TextAnimate } from '@/components/ui/text-animate';
import { features, steps, benefits, dataSources } from './welcome-data';

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
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border border-slate-200 hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${feature.bgColorClass}`}>
                  <feature.icon
                    className={`w-6 h-6 ${feature.iconColorClass}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p
                    className="text-slate-600"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
            {steps.map((step, index) => (
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
                    __html: step.text.replace(
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
            {benefits.map((benefit, index) => (
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
            {dataSources.map((source, index) => (
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
