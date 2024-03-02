'use client';

import {useState} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {TabConfig} from '@/types/tab';
import {useDesignerTabManager} from './designer-tab-manager';

type DesignerNavigationProps = {
  tabs: TabConfig[];
  className?: string;
};

export const DesignerNavigation = ({
  tabs,
  className,
}: DesignerNavigationProps) => {
  const [open, setOpen] = useState(false);
  const {activeTab, setActiveTab} = useDesignerTabManager();

  return (
    <nav className={cn('flex h-full items-center space-x-2 pl-4', className)}>
      <div className="hidden h-full md:flex">
        {tabs.map(({tab, label}) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant="ghost"
            className={cn(
              'flex h-full items-center rounded-none border-b-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors',
              {
                'border-primary text-foreground': activeTab === tab,
                'hover:border-primary/50': activeTab !== tab,
              },
            )}
          >
            {label}
          </Button>
        ))}
      </div>

      <DropdownMenu.Root open={open}>
        <div className="flex h-16 flex-shrink-0 items-center lg:hidden">
          <DropdownMenu.Trigger asChild className="block md:hidden">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpen((prev) => !prev)}
            >
              <HamburgerMenuIcon />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="w-screen bg-card">
              <div className="mt-3 flex flex-col space-y-1 pb-2">
                {tabs.map(({label, tab}) => {
                  const isActive = activeTab === tab;

                  return (
                    <Button
                      variant="ghost"
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex flex-1 rounded-none border-l-4 border-transparent p-2 font-medium text-muted-foreground transition-colors hover:border-muted-foreground',
                        {
                          'border-primary bg-muted text-foreground': isActive,
                        },
                      )}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </div>
      </DropdownMenu.Root>
    </nav>
  );
};
