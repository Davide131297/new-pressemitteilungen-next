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
  LucideIcon,
} from 'lucide-react';

export type Feature = {
  icon: LucideIcon;
  iconColorClass: string;
  bgColorClass: string;
  title: string;
  description: string;
  highlight?: string;
};

export type Step = {
  text: string;
};

export type Benefit = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export type DataSource = {
  icon: LucideIcon;
  name: string;
  desc: string;
};

export const features: Feature[] = [
  {
    icon: Newspaper,
    iconColorClass: 'text-blue-600',
    bgColorClass: 'bg-blue-100',
    title: 'News-Seite',
    description:
      'Auf der <strong>News-Seite</strong> findest du eine Übersicht der aktuellsten und wichtigsten Neuigkeiten aus verschiedenen Quellen. Bleibe immer auf dem Laufenden mit relevanten Nachrichten.',
  },
  {
    icon: BarChart3,
    iconColorClass: 'text-green-600',
    bgColorClass: 'bg-green-100',
    title: 'Umfrage-Seite',
    description:
      'Interessierst du dich für aktuelle politische Entwicklungen? Unsere <strong>Umfrage-Seite</strong> zeigt dir die neuesten Wahlumfragen und Trends. Perfekt, um politische Stimmungen und Veränderungen nachzuvollziehen.',
  },
];

export const steps: Step[] = [
  {
    text: 'Gib einen Suchbegriff in das Suchfeld ein, um Pressemitteilungen zu durchsuchen.',
  },
  {
    text: 'Besuche die **News-Seite**, um aktuelle Neuigkeiten aus verschiedenen Kategorien anzuzeigen.',
  },
  {
    text: 'Gehe zur **Umfrage-Seite**, um die neuesten Wahlumfragen zu analysieren und zu vergleichen.',
  },
  {
    text: 'Nutze Filteroptionen, um die Ergebnisse nach Zeitraum, Quelle oder Relevanz einzugrenzen.',
  },
];

export const benefits: Benefit[] = [
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
];

export const dataSources: DataSource[] = [
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
];
