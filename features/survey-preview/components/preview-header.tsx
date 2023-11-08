'use client';

import React from 'react';
import {ArrowLeft} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';

export const PreviewHeader = ({surveyTitle}: {surveyTitle: string}) => {
  const router = useRouter();

  return (
    <header className="container flex h-16 items-center justify-between">
      <Button size="icon" variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="font-medium leading-tight">{surveyTitle}</h1>
      <span className="text-xs text-muted-foreground">Preview mode</span>
    </header>
  );
};
