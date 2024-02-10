'use client';

import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';

const links = [
  {path: '/build', label: 'Build'},
  {path: '/responses', label: 'Responses'},
  {path: '/settings', label: 'Settings', disabled: true},
];

export const DesignerLinks = () => {
  const params = useParams();
  const pathname = usePathname();

  return (
    <div className="flex w-full gap-2 border-b px-4">
      {links.map((link) => {
        const href = `/editor/${params.id}${link.path}`;
        const isActive = pathname === href;
        const isDisabled = link.disabled;

        if (isDisabled) {
          return (
            <span
              key={link.path}
              className={cn(
                'px-4 py-2 text-sm font-medium',
                'text-body text-muted-foreground',
              )}
            >
              {link.label}
              <span className="text-xs text-muted-foreground">
                {' '}
                (coming soon)
              </span>
            </span>
          );
        }

        return (
          <Link
            key={link.path}
            href={href}
            className={cn(
              'px-4 py-2 text-sm font-medium',
              isActive
                ? 'border-b-2 border-b-primary text-primary'
                : 'text-body text-muted-foreground',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};
