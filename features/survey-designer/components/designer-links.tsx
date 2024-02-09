'use client';

import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';

const links = [
  {path: '/build', label: 'Build'},
  {path: '/responses', label: 'Responses'},
];

export const DesignerLinks = () => {
  const params = useParams();
  const pathname = usePathname();

  return (
    <div className="flex gap-2 border-b p-4">
      {links.map((link) => {
        const href = `/editor/${params.id}${link.path}`;
        const isActive = pathname === href;
        return (
          <Link
            key={link.path}
            href={href}
            className={cn('text-sm', isActive ? 'text-primary' : 'text-body')}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};
