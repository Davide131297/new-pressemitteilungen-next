import React, { useState, useEffect, useRef } from 'react';
import KarteDeutschland from '../assets/Karte_Deutschland_New.svg';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import sendLogs from '@/lib/sendLogs';

function convertGeoToPixel(latitude, longitude, mapWidth, mapHeight) {
  // Germany's actual bounds
  const minLat = 47.2701114;
  const maxLat = 55.05814;
  const minLng = 5.8663425;
  const maxLng = 15.0419319;

  const x = ((longitude - minLng) / (maxLng - minLng)) * mapWidth;
  const y = ((maxLat - latitude) / (maxLat - minLat)) * mapHeight;

  return { x, y };
}

function groupDataByLocation(data) {
  return data.reduce((acc, item) => {
    const key = item.standort;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

export default function Karte({ data }) {
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [mapDimensions, setMapDimensions] = useState({
    width: 350,
    height: 'calc(100vh - 400px)',
  });
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const newHeight = isMobile
        ? window.innerHeight * 0.6 - 150
        : window.innerHeight - 450;
      // Maintain aspect ratio based on SVG viewBox (592 x 801)
      const aspectRatio = 592 / 801;
      const newWidth = newHeight * aspectRatio;
      setMapDimensions({ width: newWidth, height: newHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMarkerClick = (standorte, markerId) => {
    sendLogs(
      'info',
      `Marker clicked: ${standorte[0].standort}`,
      'map-clicked',
      `${standorte[0].standort}`,
      `${standorte[0].bundesland}`
    );
    setSelectedMarkerId(markerId);
  };

  const scrollTabs = (direction) => {
    if (scrollAreaRef.current) {
      // Get the scrollable element inside ScrollArea
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        const scrollAmount = 160; // Width of approximately 2 tabs
        const scrollLeft = scrollContainer.scrollLeft;
        const newScrollLeft =
          direction === 'left'
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount;

        scrollContainer.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  const groupedData = groupDataByLocation(data);

  return (
    <div
      className="relative mx-auto"
      style={{
        width: `${mapDimensions.width}px`,
        height: `${mapDimensions.height}px`,
      }}
    >
      <Image
        src={KarteDeutschland}
        alt="Karte"
        width={mapDimensions.width}
        height={mapDimensions.height}
        style={{ width: '100%', height: '100%' }}
      />
      {Object.keys(groupedData).map((key, index) => {
        const standorte = groupedData[key];
        const latitude = parseFloat(standorte[0].latitude);
        const longitude = parseFloat(standorte[0].longitude);
        if (isNaN(latitude) || isNaN(longitude)) {
          return null;
        }

        // Check if coordinates are within Germany bounds
        if (
          latitude < 47.2701114 ||
          latitude > 55.05814 ||
          longitude < 5.8663425 ||
          longitude > 15.0419319
        ) {
          return null;
        }

        const { x, y } = convertGeoToPixel(
          latitude,
          longitude,
          mapDimensions.width,
          mapDimensions.height
        );

        const meldung = standorte.length === 1 ? 'Meldung' : 'Meldungen';
        const markerId = `marker-${index}`;

        return (
          <Popover
            key={index}
            open={selectedMarkerId === markerId}
            onOpenChange={(open) => !open && setSelectedMarkerId(null)}
          >
            <PopoverTrigger asChild>
              <button
                className="absolute w-3 h-3 bg-red-500 rounded-full cursor-pointer z-10 hover:bg-red-600 transition-colors border-0 p-0"
                style={{
                  top: `${y}px`,
                  left: `${x}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleMarkerClick(standorte, markerId)}
                title={`${standorte[0].standort} - ${standorte.length} ${meldung}`}
              />
            </PopoverTrigger>
            <PopoverContent className="w-96 max-w-[90vw]" side="top">
              <Card className="border-0 shadow-none">
                <Tabs defaultValue="0" className="w-full">
                  {standorte.length > 1 ? (
                    <div className="relative">
                      <div className="flex items-center gap-1 mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => scrollTabs('left')}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <ScrollArea className="flex-1" ref={scrollAreaRef}>
                          <TabsList
                            className="grid w-max grid-flow-col gap-1"
                            style={{ minWidth: '100%' }}
                          >
                            {standorte.map((_, tabIndex) => (
                              <TabsTrigger
                                key={tabIndex}
                                value={tabIndex.toString()}
                                className="whitespace-nowrap min-w-[80px]"
                              >
                                Fall {tabIndex + 1}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </ScrollArea>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => scrollTabs('right')}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <TabsList className="grid w-full grid-cols-1 mb-3">
                      <TabsTrigger value="0">Fall 1</TabsTrigger>
                    </TabsList>
                  )}
                  {standorte.map((standort, tabIndex) => (
                    <TabsContent
                      key={tabIndex}
                      value={tabIndex.toString()}
                      className="mt-4"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          {standort.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {standort.standort}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {standort.date}
                        </p>
                        <Button asChild className="mt-3">
                          <a
                            href={standort.fullArticleURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Zum Artikel
                          </a>
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
