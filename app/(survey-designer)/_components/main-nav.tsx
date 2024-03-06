'use client';

import React from 'react';
import {MainNavItem} from 'config/dashboard';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/utils/classnames';

type Props = {
  items: MainNavItem[];
};

export const MainNav = ({items}: Props) => {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'inline-block border-b-2 border-b-transparent py-5 text-sm font-semibold md:px-4',
            {
              'border-b-primary': pathname === '/home',
            },
          )}
        >
          {item.title}
        </Link>
      ))}
    </>
  );
};
