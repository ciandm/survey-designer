'use client';

import {sortChoices} from '@/app/(survey)/_utils/question';
import {Card} from '@/components/ui/card';
import {SurveyForm} from '../../(survey)/_components/survey-form';
import {useSurveyId, useSurveySchema} from '../_store/survey-designer-store';

export const SurveyPreviewer = () => {
  const id = useSurveyId();
  const schema = sortChoices(useSurveySchema());

  return (
    <div className="container max-w-2xl">
      <header className="mb-2 flex flex-col space-y-1 bg-card p-3 sm:bg-transparent sm:p-5">
        <h1 className="text-lg font-semibold">{schema.title}</h1>
        <p className="text-sm text-muted-foreground">{schema.description}</p>
      </header>
      <Card>
        <SurveyForm shouldSubmitResults={false} schema={schema} surveyId={id} />
      </Card>
    </div>
  );
};
