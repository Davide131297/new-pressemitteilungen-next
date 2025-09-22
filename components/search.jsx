'use client';

import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { CalendarIcon, Loader2, StopCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const DatePickerField = ({ label, value, onChange, side = 'start' }) => {
  return (
    <div className="flex flex-col w-full sm:w-56">
      <span className="text-sm font-medium mb-1">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal h-10',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value
              ? dayjs(value).locale('de').format('DD.MM.YYYY')
              : 'Datum wählen'}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align={side === 'start' ? 'start' : 'end'}
        >
          <Calendar
            mode="single"
            selected={value ? value.toDate?.() || value : undefined}
            onSelect={(d) => d && onChange(dayjs(d))}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Search = ({
  query,
  setQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleApiCall,
  loading,
  elapsedTime,
  data,
  handleStopSearch,
}) => {
  return (
    <TooltipProvider>
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="flex flex-wrap gap-4 items-start">
          {/* Suchbegriff */}
          <div className="flex flex-col w-full sm:w-64">
            <label className="text-sm font-medium mb-1" htmlFor="search-query">
              Suchbegriff
            </label>
            <Input
              id="search-query"
              value={query}
              placeholder="Suchbegriff eingeben"
              onChange={(e) => setQuery(e.target.value)}
              className="h-10"
            />
          </div>
          {/* Start / End Datum */}
          <DatePickerField
            label="Startdatum"
            value={startDate}
            onChange={setStartDate}
            side="start"
          />
          <DatePickerField
            label="Enddatum"
            value={endDate}
            onChange={setEndDate}
            side="end"
          />
          {/* Action Buttons aligned */}
          <div className="flex flex-row w-full sm:w-auto mt-2 sm:mt-6 gap-2">
            <Button
              variant="outline"
              disabled={loading}
              onClick={handleApiCall}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Suche...
                </span>
              ) : (
                'Fälle Suchen'
              )}
            </Button>
            {loading && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleStopSearch}
                    className="h-10 w-10"
                    aria-label="Suche abbrechen"
                  >
                    <StopCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Suche abbrechen</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        {/* Ergebnis Info */}
        {elapsedTime !== null && (
          <div className="mt-2 text-sm">
            Dauer der Suche: {Math.floor(elapsedTime / 60)} Minuten{' '}
            {Math.floor(elapsedTime % 60)} Sekunden - Anzahl der Ergebnisse:{' '}
            {data.length}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Search;
