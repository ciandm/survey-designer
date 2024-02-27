'use client';

import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {Button} from './ui/button';

export const TopBar = () => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 flex items-center border-b bg-blue-950">
      <div className="flex w-full items-center justify-between px-4">
        <Link
          href="/home"
          className={cn(
            'inline-block border-b-2 border-b-transparent py-5 text-sm font-semibold text-white md:px-4',
            {
              'border-b-white': pathname === '/home',
            },
          )}
        >
          Home
        </Link>
        {pathname !== '/home' && pathname !== '/create' && (
          <Button size="sm" asChild>
            <Link href="/create">Create survey</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
