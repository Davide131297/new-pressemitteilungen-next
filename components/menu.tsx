'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import sendLogs from '@/lib/sendLogs';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'News', path: '/news' },
  { label: 'Umfragen', path: '/umfragen' },
];

export default function MenuBox() {
  const router = useRouter();
  const currentPath = usePathname();

  const handleNavigation = (path: string) => {
    sendLogs('info', `Navigating to ${path}`).catch((err) => {
      console.error('Fehler beim Senden an /api/info:', err);
    });
    router.push(path);
  };

  return (
    <div className="grid w-full grid-cols-3 gap-1 rounded-full bg-muted p-1">
      {NAV_ITEMS.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              'rounded-full px-2 py-2 text-center text-xs font-medium transition-colors sm:text-sm',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
