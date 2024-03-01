export type DesignerTab = 'designer' | 'preview' | 'responses';

export type TabConfig = {
  label: string;
  tab: DesignerTab;
};

export const tabConfig: TabConfig[] = [
  {
    label: 'Designer',
    tab: 'designer' as const,
  },
  {
    label: 'Preview',
    tab: 'preview' as const,
  },
  {
    label: 'Responses',
    tab: 'responses' as const,
  },
];

export const demoTabConfig: TabConfig[] = [
  {
    label: 'Designer',
    tab: 'designer',
  },
  {
    label: 'Preview',
    tab: 'preview',
  },
];
