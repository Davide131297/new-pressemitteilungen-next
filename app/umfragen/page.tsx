'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Institute,
  Parliament,
  Party,
  Survey,
} from '@/components/myInterfaces';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import sendLogs from '@/lib/sendLogs';
import { format, parse, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import CoalitionChart from '@/components/coalitionChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  ArcElement
);

type ApiResponse = {
  Surveys: Record<string, Survey>;
  Parliaments: Record<string, Parliament>;
  Institutes: Record<string, { Name: string }>;
  Parties: Record<string, { Shortcut: string; Name: string }>;
};

type RSSItem = {
  title: string;
  link: string;
  pubDate: string;
  category: string[];
};

const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, 'dd.MM.yyyy', { locale: de });
};

const formatRSSDate = (dateString: string) => {
  const date = parse(dateString, 'EEE, dd MMM yyyy HH:mm:ss X', new Date());
  return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
};

const parseRSS = (xmlText: string): RSSItem[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const items = xmlDoc.querySelectorAll('item');
  return Array.from(items).map((item) => ({
    title: item.querySelector('title')?.textContent?.trim() || '',
    link: item.querySelector('link')?.textContent?.trim() || '',
    pubDate: item.querySelector('pubDate')?.textContent?.trim() || '',
    category: Array.from(item.querySelectorAll('category')).map(
      (cat) => cat.textContent || ''
    ),
  }));
};

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [parliaments, setParliaments] = useState<Parliament[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [totalSeats, setTotalSeats] = useState(0);

  const [selectedParliament, setSelectedParliament] = useState('Bundestag');
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(
          'https://api.dawum.de/newest_surveys.json'
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data: ApiResponse = await response.json();

        setParliaments(
          Object.entries(data.Parliaments).map(([id, parliament]) => ({
            ...parliament,
            id: Number(id),
          }))
        );
        setInstitutes(
          Object.entries(data.Institutes).map(([id, { Name }]) => ({
            id: Number(id),
            Name,
          }))
        );
        setSurveys(
          Object.entries(data.Surveys).map(([id, survey]) => ({
            ...survey,
            id: Number(id),
          }))
        );
        setParties(
          Object.entries(data.Parties).map(([id, party]) => ({
            id: Number(id),
            ...party,
          }))
        );

        const latestSurvey = Object.values(data.Surveys).sort(
          (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
        )[0];
        const latestInstitute = data.Institutes[latestSurvey.Institute_ID].Name;
        setSelectedInstitute(latestInstitute);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRSS = async () => {
      try {
        const rssResponse = await fetch('/api/rss-dawum');
        const rssText = await rssResponse.text();
        const parsedRSS = parseRSS(rssText);
        console.log('Parsed RSS:', parsedRSS);
        setRssItems(parsedRSS);
      } catch (rssError) {
        console.error('RSS fetch error:', rssError);
      }
    };

    fetchSurveys();
    fetchRSS();
  }, []);

  const handleParliamentChange = (value: string) => {
    sendLogs('info', `Parlament gewechselt: ${value}`, 'survey');
    setSelectedParliament(value);

    // Nach dem Wechsel das Institut der aktuellsten Umfrage für das neue Parlament wählen
    const parliament = parliaments.find((p) => p.Shortcut === value);
    if (parliament) {
      // Finde die neueste Umfrage für das gewählte Parlament
      const surveysForParliament = surveys
        .filter((survey) => Number(survey.Parliament_ID) === parliament.id)
        .sort(
          (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()
        );
      if (surveysForParliament.length > 0) {
        const latestSurvey = surveysForParliament[0];
        const instituteObj = institutes.find(
          (i) => i.id === Number(latestSurvey.Institute_ID)
        );
        if (instituteObj) {
          setSelectedInstitute(instituteObj.Name);
        }
      }
    }
  };

  const handleInstituteChange = (value: string) => {
    sendLogs('info', `Institut gewechselt: ${value}`, 'survey');
    setSelectedInstitute(value);
  };

  const filteredSurveys = useMemo(() => {
    const parliament = parliaments.find(
      (p) => p.Shortcut === selectedParliament
    );
    const institute = institutes.find((i) => i.Name === selectedInstitute);

    if (!parliament || !institute) return [];

    return surveys
      .filter(
        (survey) =>
          Number(survey.Parliament_ID) === parliament.id &&
          Number(survey.Institute_ID) === institute.id
      )
      .sort((a, b) => b.id - a.id);
  }, [selectedParliament, selectedInstitute, surveys, parliaments, institutes]);

  const latestSurveyResults = useMemo(() => {
    if (filteredSurveys.length === 0) return null;
    const latestSurvey = filteredSurveys[0];
    return {
      date: latestSurvey.Date,
      results: Object.entries(latestSurvey.Results).map(([partyId, result]) => {
        const party = parties.find((p) => p.id === Number(partyId));
        return {
          partyShortcut: party ? party.Shortcut : 'Unknown Party',
          result,
        };
      }),
      parliamentId: latestSurvey.Parliament_ID,
    };
  }, [filteredSurveys, parties]);

  const chartData = useMemo(() => {
    if (!latestSurveyResults) return null;

    const colorMapping: { [key: string]: string } = {
      'CDU/CSU': '#000000',
      SPD: '#FF0000',
      Grüne: '#00FF00',
      FDP: '#FFFF00',
      AfD: '#0000FF',
      Linke: '#FF00FF',
      BSW: '#610B38',
      'Freie Wähler': '#FF7F50',
      CSU: '#000000',
      CDU: '#000000',
      Sonstige: '#808080',
    };

    const sortedResults = latestSurveyResults.results
      .filter((result) => result.partyShortcut !== 'Sonstige')
      .sort((a, b) => b.result - a.result);

    const others = latestSurveyResults.results.find(
      (result) => result.partyShortcut === 'Sonstige'
    );

    if (others) sortedResults.push(others);

    return {
      labels: sortedResults.map((result) => result.partyShortcut),
      datasets: [
        {
          label: 'Ergebnis in %',
          data: sortedResults.map((result) => result.result),
          backgroundColor: sortedResults.map(
            (result) => colorMapping[result.partyShortcut] || '#CCCCCC'
          ),
        },
      ],
    };
  }, [latestSurveyResults]);

  const seatDistribution = useMemo(() => {
    if (!latestSurveyResults) return null;

    const seatsByParliamentId: { [key: string]: number } = {
      '0': 630, // Bundestag
      '1': 145, // BW
      '2': 203, // Bayern
      '3': 159, // Berlin
      '4': 88, // Brandenburg
      '5': 87, // Bremen
      '6': 123, // Hamburg
      '7': 133, // Hessen
      '8': 79, // Mecklenburg-Vorpommern
      '9': 146, // Niedersachsen
      '10': 195, // NRW
      '11': 101, // Rheinland-Pfalz
      '12': 51, // Saarland
      '13': 120, // Sachsen
      '14': 97, // Sachsen-Anhalt
      '15': 69, // Schleswig-Holstein
      '16': 88, // Thüringen
      '17': 96, // EU
    };

    const totalSeats =
      seatsByParliamentId[latestSurveyResults.parliamentId] || 0;
    setTotalSeats(totalSeats);

    const partiesAboveThreshold = latestSurveyResults.results.filter(
      (party) => party.result >= 5 && party.partyShortcut !== 'Sonstige'
    );

    const totalValidVotes = partiesAboveThreshold.reduce(
      (sum, party) => sum + party.result,
      0
    );

    const distribution = partiesAboveThreshold.map((party) => {
      const exactSeats = (party.result / totalValidVotes) * totalSeats;
      return {
        partyShortcut: party.partyShortcut,
        seats: Math.floor(exactSeats),
      };
    });
    return distribution.map(({ partyShortcut, seats }) => ({
      partyShortcut,
      seats,
    }));
  }, [latestSurveyResults]);

  const doughnutChartData = useMemo(() => {
    if (!seatDistribution) return null;

    const colorMapping: { [key: string]: string } = {
      'CDU/CSU': '#000000',
      SPD: '#FF0000',
      Grüne: '#00FF00',
      FDP: '#FFFF00',
      AfD: '#0000FF',
      Linke: '#FF00FF',
      BSW: '#610B38',
      'Freie Wähler': '#FF7F50',
      CSU: '#000000',
      CDU: '#000000',
      Sonstige: '#808080',
    };

    return {
      labels: seatDistribution.map((party) => party.partyShortcut),
      datasets: [
        {
          data: seatDistribution.map((party) => party.seats),
          backgroundColor: seatDistribution.map(
            (party) => colorMapping[party.partyShortcut] || '#CCCCCC'
          ),
        },
      ],
    };
  }, [seatDistribution]);

  return (
    <>
      <div className="px-4 md:px-8">
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Loading...</div>
            </div>
          ) : (
            <>
              <Card className="mt-8 max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parliament-select">Parlament</Label>
                      <Select
                        value={selectedParliament}
                        onValueChange={handleParliamentChange}
                      >
                        <SelectTrigger id="parliament-select">
                          <SelectValue placeholder="Parlament auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {parliaments.map((parliament) => (
                            <SelectItem
                              key={parliament.id}
                              value={parliament.Shortcut}
                            >
                              {parliament.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institute-select">Institut</Label>
                      <Select
                        value={selectedInstitute}
                        onValueChange={handleInstituteChange}
                      >
                        <SelectTrigger id="institute-select">
                          <SelectValue placeholder="Institut auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {institutes.map((institute) => (
                            <SelectItem
                              key={institute.id}
                              value={institute.Name}
                            >
                              {institute.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {latestSurveyResults && chartData ? (
                <div className="mt-8 mx-auto container">
                  <div className="md:flex md:flex-wrap md:justify-between md:space-x-4">
                    <div className="w-full md:w-[calc(50%-0.5rem)] mb-8">
                      <Card>
                        <CardContent className="p-6">
                          <h2 className="text-lg font-semibold mb-4">{`Umfrage vom ${formatDate(
                            latestSurveyResults.date
                          )}`}</h2>
                          <div className="h-[400px]">
                            <Bar
                              data={chartData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                  },
                                  title: {
                                    display: false,
                                  },
                                  datalabels: {
                                    display: true,
                                    align: 'end',
                                    anchor: 'end',
                                    formatter: (value) => `${value}%`,
                                  },
                                  annotation:
                                    latestSurveyResults.parliamentId !== '17'
                                      ? {
                                          annotations: {
                                            line1: {
                                              type: 'line',
                                              yMin: 5,
                                              yMax: 5,
                                              borderColor: 'red',
                                              borderWidth: 2,
                                              label: {
                                                content: 'Threshold',
                                                display: false,
                                                position: 'center',
                                              },
                                            },
                                          },
                                        }
                                      : {},
                                },
                              }}
                              plugins={[ChartDataLabels]}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="w-full md:w-[calc(50%-0.5rem)] mb-8">
                      <Card>
                        <CardContent className="p-6">
                          <h2 className="text-lg font-semibold mb-4">{`Sitzverteilung basierend auf Umfrage vom ${formatDate(
                            latestSurveyResults.date
                          )} mit ${totalSeats} Sitzen`}</h2>
                          <div className="h-[400px]">
                            <Doughnut
                              data={
                                doughnutChartData || {
                                  labels: [],
                                  datasets: [],
                                }
                              }
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  datalabels: {
                                    display: true,
                                    color: 'white',
                                    font: {
                                      weight: 'bold',
                                    },
                                    padding: 5,
                                  },
                                  legend: {
                                    position: 'top',
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: (tooltipItem) => {
                                        const value = tooltipItem.raw;
                                        return `${value}`;
                                      },
                                    },
                                  },
                                },
                              }}
                              plugins={[ChartDataLabels]}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    {seatDistribution && (
                      <CoalitionChart
                        seatDistribution={seatDistribution}
                        totalSeats={totalSeats}
                      />
                    )}
                  </div>

                  <div className="mt-12 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                      Neueste Wahlumfragen
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {rssItems.map((item, index) => (
                        <Card
                          key={index}
                          className="hover:shadow-lg transition-shadow duration-300"
                        >
                          <CardContent className="p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight">
                              {item.title}
                            </h3>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.category
                                .slice(0, 3)
                                .map((cat, catIndex) => (
                                  <span
                                    key={catIndex}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {cat}
                                  </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                {formatRSSDate(item.pubDate)}
                              </span>
                              <Link
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Details
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {rssItems.length > 0 && (
                      <div className="text-center mt-6">
                        <Button
                          onClick={() =>
                            window.open('https://dawum.de', '_blank')
                          }
                          className="gap-2"
                        >
                          Alle Umfragen auf DAWUM
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <Card className="m-4 bg-gray-50">
                    <CardContent className="p-4 text-center text-sm">
                      <strong>Hinweis:</strong> Die Umfrageergebnisse basieren
                      auf Daten von{' '}
                      <Link
                        href="https://dawum.de"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        dawum.de
                      </Link>{' '}
                      (
                      <Link
                        href="https://opendatacommons.org/licenses/odbl/1-0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open Database License (ODbL)
                      </Link>
                      )
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="mt-8 text-center">
                  <Card>
                    <CardContent className="p-8">
                      <p className="text-gray-600">Keine Umfrage gefunden.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
