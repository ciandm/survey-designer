'use client';

import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import {replaceLinkHrefs} from '@/app/(survey)/_utils/links';
import {DESIGNER_LINKS} from '@/lib/constants/links';
import {cn} from '@/lib/utils';

export const NavLinks = () => {
  const pathname = usePathname();
  const {id} = useParams() as {id: string};

  return (
    <nav className="hidden h-full items-center space-x-2 pl-4 md:flex">
      {replaceLinkHrefs(DESIGNER_LINKS, id).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'flex h-full items-center border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground',
            {
              'border-primary text-foreground': pathname === link.href,
            },
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
