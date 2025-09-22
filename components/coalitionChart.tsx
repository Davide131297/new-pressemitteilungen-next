import React, { useMemo, useCallback } from 'react';
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
  const majority = Math.ceil(totalSeats / 2) + 1; // 316 seats needed for majority

  const generateCombinations = useCallback(
    (arr: Party[], n: number): Party[][] => {
      if (n === 0) return [[]];
      if (arr.length === 0) return [];

      const [head, ...tail] = arr;
      const withoutHead = generateCombinations(tail, n);
      const withHead = generateCombinations(tail, n - 1).map((combo) => [
        head,
        ...combo,
      ]);

      return [...withoutHead, ...withHead];
    },
    []
  );

  const validCoalitions = useMemo(() => {
    // Find only minimal coalitions that achieve majority
    const findMinimalCoalitions = () => {
      const validCoalitions: {
        coalition: string[];
        seats: number;
        percentage: number;
      }[] = [];

      // Start with smallest possible coalitions and work up
      for (let size = 1; size <= seatDistribution.length; size++) {
        const combinations = generateCombinations(seatDistribution, size);

        combinations.forEach((coalition) => {
          const coalitionSeats = coalition.reduce(
            (sum, party) => sum + party.seats,
            0
          );

          // Only consider coalitions that achieve majority
          if (coalitionSeats >= majority) {
            const coalitionParties = coalition.map(
              (party) => party.partyShortcut
            );

            // Check if this coalition is minimal (removing any party would lose majority)
            const isMinimal = coalition.every((party) => {
              const seatsWithoutThisParty = coalitionSeats - party.seats;
              return seatsWithoutThisParty < majority;
            });

            if (isMinimal) {
              // Also check if we don't already have a subset of this coalition
              const isRedundant = validCoalitions.some((existing) => {
                return (
                  existing.coalition.every((party) =>
                    coalitionParties.includes(party)
                  ) && existing.coalition.length < coalitionParties.length
                );
              });

              if (!isRedundant) {
                const percentage =
                  Math.round((coalitionSeats / totalSeats) * 10000) / 100;

                validCoalitions.push({
                  coalition: coalitionParties,
                  seats: coalitionSeats,
                  percentage,
                });
              }
            }
          }
        });

        // If we found valid minimal coalitions at this size,
        // we can skip checking larger sizes for efficiency
        if (validCoalitions.length > 0 && size >= 2) {
          // But we still need to check if there are other minimal coalitions of the same or larger size
          // So we continue but filter out non-minimal ones
        }
      }

      // Remove any coalitions that are supersets of smaller valid coalitions
      return validCoalitions
        .filter((coalition) => {
          return !validCoalitions.some(
            (other) =>
              other.coalition.length < coalition.coalition.length &&
              other.coalition.every((party) =>
                coalition.coalition.includes(party)
              )
          );
        })
        .sort((a, b) => {
          // Sort by coalition size first, then by seats
          if (a.coalition.length !== b.coalition.length) {
            return a.coalition.length - b.coalition.length;
          }
          return b.seats - a.seats;
        });
    };

    return findMinimalCoalitions();
  }, [seatDistribution, totalSeats, majority, generateCombinations]);

  // Create chart data for each coalition
  const createChartData = (coalition: {
    coalition: string[];
    seats: number;
  }) => {
    // Sort parties by seat count (largest to smallest)
    const sortedParties = coalition.coalition
      .map(
        (partyShortcut) =>
          ({
            partyShortcut,
            seats:
              seatDistribution.find(
                (party) => party.partyShortcut === partyShortcut
              )?.seats || 0,
          } as Party)
      )
      .sort((a, b) => b.seats - a.seats);

    return {
      labels: sortedParties.map((party) => party.partyShortcut),
      datasets: [
        {
          data: sortedParties.map((party) => party.seats),
          backgroundColor: sortedParties.map(
            (party) => colorMapping[party.partyShortcut] || '#CCCCCC'
          ),
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => {
            const value = tooltipItem.raw as number;
            const label = tooltipItem.label || '';
            const percentage =
              Math.round((value / totalSeats) * 100 * 100) / 100;
            return `${label}: ${value} Sitze (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        formatter: (value: number) => `${value}`,
        color: 'white',
        font: {
          weight: 'bold' as const,
          size: 10,
        },
      },
    },
  };

  return (
    <div className="bg-slate-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-3 text-center">
        Regierungskoalitionen
      </h2>
      <p className="text-center text-xs text-gray-600 mb-4">
        Benötigte Mehrheit: {majority} von {totalSeats} Sitzen (
        {Math.round((majority / totalSeats) * 10000) / 100}%)
      </p>

      {validCoalitions.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {validCoalitions.map((coalition, index) => {
            const coalitionPercentage =
              Math.round((coalition.seats / totalSeats) * 10000) / 100;

            // Sort parties for display in title
            const sortedPartiesForTitle = coalition.coalition
              .map(
                (partyShortcut) =>
                  ({
                    partyShortcut,
                    seats:
                      seatDistribution.find(
                        (party) => party.partyShortcut === partyShortcut
                      )?.seats || 0,
                  } as Party)
              )
              .sort((a, b) => b.seats - a.seats)
              .map((party) => party.partyShortcut);

            return (
              <div key={index} className="bg-white p-3 rounded-lg shadow-md">
                <h3 className="text-xs font-semibold mb-1 text-center">
                  {sortedPartiesForTitle.join(' + ')}
                </h3>
                <p className="text-xs text-center text-gray-600 mb-2">
                  {coalition.seats} Sitze ({coalitionPercentage}%)
                </p>
                <div className="h-24">
                  <Doughnut
                    data={createChartData(coalition)}
                    options={options}
                    plugins={[ChartDataLabels]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Keine Koalition möglich.</p>
          <p className="text-sm text-gray-500 mt-2">
            Keine Kombination von Parteien erreicht die benötigte Mehrheit von{' '}
            {majority} Sitzen.
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p className="text-center">
          Insgesamt {validCoalitions.length} Regierungskoalitionen möglich
        </p>
      </div>
    </div>
  );
}

export default CoalitionChart;
