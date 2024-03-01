'use client';

import {Card} from '@/components/ui/card';
import {SurveyForm} from '@/survey/_components/survey-form';
import {sortChoices} from '@/survey/_utils/question';
import {
  useSurveyId,
  useSurveySchema,
} from '@/survey-designer/_store/survey-designer-store';

export const SurveyPreviewer = () => {
  const id = useSurveyId();
  const schema = sortChoices(useSurveySchema());

  return (
    <>
      <header className="mb-2 flex flex-col space-y-1 bg-muted p-3 sm:mb-6 sm:bg-transparent sm:p-0">
        <h1 className="text-lg font-semibold">{schema.title}</h1>
        <p className="text-sm text-muted-foreground">{schema.description}</p>
      </header>
      <Card>
        <SurveyForm shouldSubmitResults={false} schema={schema} surveyId={id} />
      </Card>
    </>
  );
};
