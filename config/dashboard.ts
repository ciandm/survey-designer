import {getSiteUrl} from '@/lib/hrefs';

export const dashboardConfig = {
  mainNav: [
    {
      title: 'Home',
      href: getSiteUrl.dashboardPage(),
    },
  ],
};

export type DashboardConfig = typeof dashboardConfig;
export type MainNavItem = DashboardConfig['mainNav'][number];
