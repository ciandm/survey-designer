'use client';

import {ArrowLeft} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Survey} from '@/features/survey-tool/components/survey';
import {useDesignerModeActions} from '../store/designer-mode';
import {useSurveyDetails, useSurveySchema} from '../store/survey-designer';

export const SurveyPreviewer = () => {
  const {title} = useSurveyDetails();
  const schema = useSurveySchema();
  const {updateMode} = useDesignerModeActions();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <header className="h-12 flex-shrink-0 border-b">
        <div className="container flex h-full items-center justify-between">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => updateMode('edit')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-sm font-medium leading-tight">
            {title || 'Untitled Survey'}
          </h1>
          <Badge>Live preview</Badge>
        </div>
      </header>
      <div className="flex w-full flex-grow overflow-hidden bg-muted">
        <div className="flex flex-1 p-8">
          <div className="mx-auto w-full max-w-2xl py-16">
            <Survey schema={schema} />
          </div>
        </div>
      </div>
    </div>
  );
};
