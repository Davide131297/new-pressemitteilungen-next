import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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

interface Party {
  partyShortcut: string;
  seats: number;
}

interface CoalitionChartProps {
  seatDistribution: Party[];
  totalSeats: number;
}

function CoalitionChart({ seatDistribution, totalSeats }: CoalitionChartProps) {
  const majority = Math.ceil(totalSeats / 2);

  // Funktion zur Generierung von Kombinationen
  const generateCombinations = (arr: Party[], n: number): Party[][] => {
    if (n === 0) return [[]];
    if (arr.length === 0) return [];

    const [head, ...tail] = arr;
    const withoutHead = generateCombinations(tail, n);
    const withHead = generateCombinations(tail, n - 1).map((combo) => [
      head,
      ...combo,
    ]);

    return [...withoutHead, ...withHead];
  };

  // Funktion zur Berechnung der minimalen Koalitionen
  const findMinimalCoalitions = () => {
    const validCoalitions: { coalition: string[]; seats: number }[] = [];

    // Start mit der kleinsten Anzahl an Parteien und arbeite dich nach oben
    for (let i = 2; i <= seatDistribution.length; i++) {
      const combinations = generateCombinations(seatDistribution, i);

      // Finde die ersten Koalitionen, die die Mehrheit erreichen
      combinations.forEach((coalition) => {
        const totalSeats = coalition.reduce(
          (sum, party) => sum + party.seats,
          0
        );

        // Nur Koalitionen, die die Mehrheit erreichen
        if (totalSeats >= majority) {
          const coalitionParties = coalition.map(
            (party) => party.partyShortcut
          );
          // Wenn diese Koalition eine "minimal" Koalition ist (ohne unnötige Parteien)
          if (
            !validCoalitions.some(
              (existing) =>
                existing.seats >= totalSeats &&
                coalitionParties.every((p) => existing.coalition.includes(p))
            )
          ) {
            validCoalitions.push({
              coalition: coalitionParties,
              seats: totalSeats,
            });
          }
        }
      });

      // Wenn wir gültige Koalitionen finden, die die Mehrheit erreichen, stoppen wir die Suche
      if (validCoalitions.length > 0) {
        break;
      }
    }

    return validCoalitions;
  };

  const validCoalitions = useMemo(
    () => findMinimalCoalitions(),
    [seatDistribution, totalSeats]
  );

  // Funktion zur Erstellung der Chart-Daten
  const createChartData = (coalition: {
    coalition: string[];
    seats: number;
  }) => ({
    labels: coalition.coalition,
    datasets: [
      {
        data: coalition.coalition.map(
          (partyShortcut) =>
            seatDistribution.find(
              (party) => party.partyShortcut === partyShortcut
            )?.seats || 0
        ),
        backgroundColor: coalition.coalition.map(
          (partyShortcut) => colorMapping[partyShortcut] || '#CCCCCC'
        ),
      },
    ],
  });

  // Chart-Optionen
  const options = {
    responsive: true,
    rotation: -90, // Start oben
    circumference: 180, // Halbkreis
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => {
            const value = tooltipItem.raw as number; // `raw` ist als `unknown` definiert, daher casten
            const label = tooltipItem.label || ''; // Sicherstellen, dass `label` nicht undefined ist
            return `${label}: ${value} Sitze`;
          },
        },
      },
      datalabels: {
        display: true,
        formatter: (value: number) => `${value}`,
        color: 'white',
        font: {
          weight: 'bold' as const,
        },
      },
    },
  };

  return (
    <div className="bg-slate-100">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Koalitionsmöglichkeiten
      </h2>
      {validCoalitions.length > 0 ? (
        <div className="flex flex-wrap justify-center items-center">
          {validCoalitions.map((coalition, index) => (
            <div key={index} className="w-1/3 p-2">
              <h3 className="text-md font-semibold mb-2 text-center">
                Koalition {coalition.coalition.join(' + ')} - {coalition.seats}{' '}
                Sitze
              </h3>
              <div className="h-[150px] md:h-[300px]">
                <Doughnut
                  data={createChartData(coalition)}
                  options={options}
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">Keine gültige Koalition möglich.</p>
      )}
    </div>
  );
}

export default CoalitionChart;
