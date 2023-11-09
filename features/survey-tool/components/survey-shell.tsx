import React from 'react';
import {ArrowLeft} from 'lucide-react';
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
          <h1 className="font-medium leading-tight">{surveyTitle}</h1>
          <span className="text-xs text-muted-foreground">Preview mode</span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center bg-primary-foreground py-20">
        <div className="flex h-full w-full max-w-5xl flex-1">{children}</div>
      </main>
    </div>
  );
};
