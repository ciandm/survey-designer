import React from 'react';
import {Copy, RefreshCw, Trash} from 'lucide-react';
import {Button} from '@/components/ui/button';

const footerActions = [
  {
    label: 'Delete',
    icon: <Trash className="h-4 w-4 flex-shrink-0" />,
  },
  {
    label: 'Duplicate',
    icon: <Copy className="h-4 w-4 flex-shrink-0" />,
  },
];

export const EditorFooter = () => {
  return (
    <footer className="border-t bg-background">
      <div className="flex items-center justify-between">
        <div className="flex">
          {footerActions.map(({label, icon}) => (
            <Button
              key={label}
              variant="ghost"
              size="icon"
              className="rounded-none"
            >
              {icon}
              <span className="sr-only">{label}</span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">Unsaved changes</p>
          <Button variant="ghost" size="icon" className="rounded-none">
            <RefreshCw className="h-4 w-4 flex-shrink-0" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>
    </footer>
  );
};
