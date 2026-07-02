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
          className="text-3xl font-bold text-primary sm:text-4xl"
        >
          Willkommen auf der Seite PresseFinder
        </TextAnimate>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          PresseFinder ist dein One-Stop-Tool, um aktuelle Pressemitteilungen,
          die neuesten Nachrichten und Umfrageergebnisse zu finden. Diese
          Plattform bietet dir eine einfache Möglichkeit, schnell und gezielt
          Informationen aus verschiedenen Quellen zu durchsuchen und anzuzeigen.
        </p>
      </div>

      <div className="border-t border-border my-8"></div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300"
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
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-t border-border my-8"></div>

      {/* How it works */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">
              So funktioniert es
            </h3>
          </div>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary border-primary/20"
                >
                  {index + 1}
                </Badge>
                <span
                  className="text-foreground/80"
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

      <div className="border-t border-border my-8"></div>

      {/* Benefits */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">
              Warum PresseFinder nutzen?
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-border my-8"></div>

      {/* Data Sources */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">
              Datenquellen
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {dataSources.map((source, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <source.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {source.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{source.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-border my-8"></div>

      {/* Additional Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">
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
                  className="min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary border-primary/20"
                >
                  {index + 1}
                </Badge>
                <p className="text-foreground/80">{info}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
