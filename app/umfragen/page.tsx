'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {
  Institute,
  Parliament,
  Party,
  Survey,
} from '@/components/myInterfaces';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
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
import { set } from 'date-fns';

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
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

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(
          'https://api.dawum.de/newest_surveys.json'
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data: ApiResponse = await response.json();
        console.log('Einkommende Daten: ', data);

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

    fetchSurveys();
  }, []);

  const handleParliamentChange = (event: SelectChangeEvent<string>) => {
    setSelectedParliament(event.target.value);
  };

  const handleInstituteChange = (event: SelectChangeEvent<string>) => {
    setSelectedInstitute(event.target.value);
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
    console.log('Letzte Umfrage', latestSurvey);
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

    console.log('letzte umfrage', latestSurveyResults);

    let totalSeats: number = 0; // Standardinitialisierung
    if (latestSurveyResults.parliamentId === '0') {
      // Bundestag
      totalSeats = 630;
    } else if (latestSurveyResults.parliamentId === '1') {
      // BW
      totalSeats = 145;
    } else if (latestSurveyResults.parliamentId === '2') {
      // Bayern
      totalSeats = 203;
    } else if (latestSurveyResults.parliamentId === '3') {
      // Berlin
      totalSeats = 159;
    } else if (latestSurveyResults.parliamentId === '4') {
      // Brandenburg
      totalSeats = 88;
    } else if (latestSurveyResults.parliamentId === '5') {
      // Bremen
      totalSeats = 87;
    } else if (latestSurveyResults.parliamentId === '6') {
      // Hamburg
      totalSeats = 123;
    } else if (latestSurveyResults.parliamentId === '7') {
      // Hessen
      totalSeats = 133;
    } else if (latestSurveyResults.parliamentId === '8') {
      // Mecklenburg-Vorpommern
      totalSeats = 79;
    } else if (latestSurveyResults.parliamentId === '9') {
      // Niedersachsen
      totalSeats = 146;
    } else if (latestSurveyResults.parliamentId === '10') {
      //NRW
      totalSeats = 195;
    } else if (latestSurveyResults.parliamentId === '11') {
      // Rheinland-Pfalz
      totalSeats = 101;
    } else if (latestSurveyResults.parliamentId === '12') {
      // Saarland
      totalSeats = 51;
    } else if (latestSurveyResults.parliamentId === '13') {
      // Sachsen
      totalSeats = 120;
    } else if (latestSurveyResults.parliamentId === '14') {
      // Sachsen-Anhalt
      totalSeats = 97;
    } else if (latestSurveyResults.parliamentId === '15') {
      // Schleswig-Holstein
      totalSeats = 69;
    } else if (latestSurveyResults.parliamentId === '16') {
      // Thüringen
      totalSeats = 88;
    } else if (latestSurveyResults.parliamentId === '17') {
      // EU
      totalSeats = 96;
    }
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
        remainder: exactSeats % 1,
      };
    });

    const seatsAllocated = distribution.reduce(
      (sum, party) => sum + party.seats,
      0
    );
    const remainingSeats = totalSeats - seatsAllocated;

    // Verteile die restlichen Sitze nach der größten Dezimalstelle
    distribution.sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < remainingSeats; i++) {
      distribution[i % distribution.length].seats += 1;
    }

    console.log('Sitzverteilung', distribution);
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
        <Header />
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="flex justify-center gap-2 mt-8">
                <FormControl fullWidth>
                  <InputLabel id="parliament-select-label" size="small">
                    Parliament
                  </InputLabel>
                  <Select
                    labelId="parliament-select-label"
                    value={selectedParliament}
                    onChange={handleParliamentChange}
                    label="Parliament"
                    size="small"
                  >
                    {parliaments.map((parliament) => (
                      <MenuItem key={parliament.id} value={parliament.Shortcut}>
                        {parliament.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="institute-select-label" size="small">
                    Institute
                  </InputLabel>
                  <Select
                    labelId="institute-select-label"
                    value={selectedInstitute}
                    onChange={handleInstituteChange}
                    label="Institute"
                    size="small"
                  >
                    {institutes.map((institute) => (
                      <MenuItem key={institute.id} value={institute.Name}>
                        {institute.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {latestSurveyResults && chartData ? (
                <div className="mt-8 mx-auto container">
                  <div className="md:flex md:flex-wrap md:justify-between md:space-x-4">
                    <div className="w-full md:w-[calc(50%-0.5rem)] mb-8">
                      <h2 className="text-lg font-semibold mb-2">{`Umfrage vom ${formatDate(
                        latestSurveyResults.date
                      )}`}</h2>
                      <div className="h-[400px]">
                        {' '}
                        {/* Feste Höhe für das Chart */}
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
                    </div>
                    <div className="w-full md:w-[calc(50%-0.5rem)] mb-8">
                      <h2 className="text-lg font-semibold mb-2">{`Sitzverteilung basierend auf Umfrage vom ${formatDate(
                        latestSurveyResults.date
                      )} mit ${totalSeats} Sitzen`}</h2>
                      <div className="h-[400px]">
                        {' '}
                        {/* Feste Höhe für das Chart */}
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
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    Daten von{' '}
                    <a
                      href="https://dawum.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      dawum.de
                    </a>{' '}
                    (
                    <a
                      href="https://opendatacommons.org/licenses/odbl/1-0/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Open Database License (ODbL)
                    </a>
                    )
                  </div>
                </div>
              ) : (
                <div className="mt-8">No results found for the selection.</div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
