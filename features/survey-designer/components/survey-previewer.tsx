'use client';

import {Card} from '@/components/ui/card';
import {sortChoices} from '@/features/survey-tool/utils/question';
import {SurveyForm} from '../../survey-tool/components/survey-form';
import {
  surveyIdSelector,
  surveySchemaSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer-store';

export const SurveyPreviewer = () => {
  const id = useSurveyDesignerStore(surveyIdSelector);
  const schema = sortChoices(useSurveyDesignerStore(surveySchemaSelector));

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
