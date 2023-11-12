'use client';

import {ArrowLeft} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {QuestionForm} from '@/features/survey-tool/components/question-form';
import {useResponsesWorkflow} from '@/features/survey-tool/hooks/use-responses-workflow';
import {useDesignerModeActions} from '../store/designer-mode';
import {useSurveyDetails, useSurveyQuestions} from '../store/survey-designer';

export const SurveyPreviewer = () => {
  const {title} = useSurveyDetails();
  const questions = useSurveyQuestions();
  const {updateMode} = useDesignerModeActions();
  const {currentQuestionId, handlers, responses} = useResponsesWorkflow({
    questions,
  });

  return (
    <div className="flex w-full flex-col">
      <header className="h-14 border-b">
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
      <div className="flex flex-1 items-center justify-center bg-muted p-8">
        <div className="w-full max-w-5xl">
          <QuestionForm
            questions={questions}
            currentQuestionId={currentQuestionId}
            responses={responses}
            key={currentQuestionId}
            {...handlers}
          />
        </div>
      </div>
    </div>
  );
};
