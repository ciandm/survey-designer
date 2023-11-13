import React from 'react';
import {ArrowLeft} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

interface Props
  extends React.PropsWithChildren<{
    surveyTitle: string;
    onBackClick: () => void;
  }> {}

export const SurveyShell = ({surveyTitle, onBackClick, children}: Props) => {
  return (
    <div className="flex h-screen w-full flex-col border-b bg-background">
      <header className="h-16 border-b">
        <div className="container flex h-full items-center justify-between">
          <Button size="icon" variant="ghost" onClick={onBackClick}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-medium leading-tight">
            {surveyTitle || 'Untitled Survey'}
          </h1>
          <div />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center bg-muted py-20">
        <div className="flex h-full w-full max-w-5xl flex-1">{children}</div>
      </main>
    </div>
  );
};
