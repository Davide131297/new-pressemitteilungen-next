'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/header';
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
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
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

  const [selectedParliament, setSelectedParliament] = useState('Bundestag');
  const [selectedInstitute, setSelectedInstitute] = useState('Forsa');

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(
          'https://api.dawum.de/newest_surveys.json'
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data: ApiResponse = await response.json();
        console.log(data);

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
          label: 'Umfrage Ergebnisse',
          data: sortedResults.map((result) => result.result),
          backgroundColor: sortedResults.map(
            (result) => colorMapping[result.partyShortcut] || '#CCCCCC'
          ),
        },
      ],
    };
  }, [latestSurveyResults]);

  return (
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
              <div className="mt-8">
                <h2>{`Umfrage vom ${formatDate(latestSurveyResults.date)}`}</h2>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
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
            ) : (
              <div className="mt-8">No results found for the selection.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
