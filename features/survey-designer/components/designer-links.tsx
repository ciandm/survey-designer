'use client';

import {
  AreaChartIcon,
  PaintbrushIcon,
  PencilIcon,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import {Separator} from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {cn} from '@/lib/utils';

const links = [
  [
    {path: '/designer', label: 'Designer', icon: PencilIcon},
    {path: '/themes', label: 'Themes', icon: PaintbrushIcon},
  ],
  [
    {path: '/responses', label: 'Responses', icon: AreaChartIcon},
    {path: '/', label: 'Settings', icon: Settings},
  ],
];

export const DesignerLinks = () => {
  const params = useParams();
  const pathname = usePathname();

  const [primaryLinks, secondaryLinks] = links;

  return (
    <div>
      <div className="grid justify-center gap-2 p-2">
        {primaryLinks.map((link) => {
          const href = `/editor/${params.id}${link.path}`;
          const isActive = pathname === href;
          const Icon = link.icon;

          return (
            <TooltipProvider key={link.path} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className="border-0 bg-primary text-white"
                  side="right"
                >
                  <span className="text-xs font-medium">{link.label}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
      <Separator orientation="horizontal" />
      <div className="grid justify-center gap-2 p-2">
        {secondaryLinks.map((link) => {
          const href = `/editor/${params.id}${link.path}`;
          const isActive = pathname === href;
          const Icon = link.icon;

          return (
            <TooltipProvider key={link.path} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className="border-0 bg-primary text-white"
                  side="right"
                >
                  <span className="text-xs font-medium">{link.label}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};
