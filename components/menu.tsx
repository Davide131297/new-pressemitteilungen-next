'use client';

import React from 'react';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';
import sendLogs from '@/lib/sendLogs';

export default function MenuBox() {
  const router = useRouter();
  const currentPath = usePathname();

  const handleNavigation = async (path: string) => {
    console.log(`Navigating to: ${path}`);
    try {
      await sendLogs('info', `Navigating to ${path}`);
    } catch (err) {
      console.error('Fehler beim Senden an /api/info:', err);
    }
    router.push(path);
  };

  return (
    <div className="mt-5 mb-5 w-4/5 md:w-1/2 mx-auto rounded-3xl bg-gray-100 shadow-md p-2">
      <div className="flex gap-4">
        <div className="flex-1">
          <button
            className={clsx(
              'w-full py-2 px-4 rounded-3xl text-center',
              currentPath === '/'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700'
            )}
            onClick={() => handleNavigation('/')}
          >
            Home
          </button>
        </div>
        <div className="flex-1">
          <button
            className={clsx(
              'w-full py-2 px-4 rounded-3xl text-center',
              currentPath === '/news'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700'
            )}
            onClick={() => handleNavigation('/news')}
          >
            News
          </button>
        </div>
        <div className="flex-1">
          <button
            className={clsx(
              'w-full py-2 px-4 rounded-3xl text-center',
              currentPath === '/umfragen'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700'
            )}
            onClick={() => handleNavigation('/umfragen')}
          >
            Umfragen
          </button>
        </div>
      </div>
    </div>
  );
}
