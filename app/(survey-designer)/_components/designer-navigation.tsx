'use client';

import {useState} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {DESIGNER_LINKS} from '@/lib/constants/links';
import {cn} from '@/lib/utils';
import {replaceLinkHrefs} from '@/survey/_utils/links';

export const DesignerNavigation = () => {
  const pathname = usePathname();
  const {id} = useParams() as {id: string};
  const [open, setOpen] = useState(false);

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

      <DropdownMenu.Root>
        <nav className="flex h-16 flex-shrink-0 items-center lg:hidden">
          <DropdownMenu.Trigger asChild className="block md:hidden">
            <Button size="sm" variant="ghost" onClick={() => setOpen(!open)}>
              <HamburgerMenuIcon />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="mt-4 w-screen bg-card">
              <div className="space-y-1 pb-2">
                {replaceLinkHrefs(DESIGNER_LINKS, id).map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center border-l-4 border-transparent p-2 font-medium text-muted-foreground transition-colors hover:border-muted-foreground',
                        {
                          'border-primary bg-muted text-foreground': isActive,
                        },
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </nav>
      </DropdownMenu.Root>
    </nav>
  );
};
