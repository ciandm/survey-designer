'use client';

import {
  SurveyShell,
  SurveyShellAside,
  SurveyShellMain,
} from '@/components/survey-shell';
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
    <SurveyShell>
      <SurveyShellAside title={schema.title} description={schema.description} />
      <SurveyShellMain>
        <SurveyForm shouldSubmitResults={false} schema={schema} surveyId={id} />
      </SurveyShellMain>
    </SurveyShell>
  );
};
