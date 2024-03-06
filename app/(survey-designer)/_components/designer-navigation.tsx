'use client';

import {Button} from '@/components/ui/button';
import {TabConfig} from '@/types/tab';
import {cn} from '@/utils/classnames';
import {useDesignerTabManager} from './designer-tab-manager';

type DesignerNavigationProps = {
  tabs: TabConfig[];
  className?: string;
};

export const DesignerNavigation = ({
  tabs,
  className,
}: DesignerNavigationProps) => {
  const {activeTab, setActiveTab} = useDesignerTabManager();

  return (
    <div className="flex h-11 w-full flex-shrink-0 border-t bg-white">
      <nav className={cn('flex h-full flex-1 items-center', className)}>
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
      </nav>
    </div>
  );
};
