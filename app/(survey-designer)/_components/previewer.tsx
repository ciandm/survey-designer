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

export const Previewer = () => {
  const id = useSurveyId();
  const schema = sortChoices(useSurveySchema());

  const hasNoQuestions = schema.elements.length === 0;

  const title = !!schema.title ? schema.title : 'Untitled Survey';

  if (hasNoQuestions) {
    return (
      <SurveyShell>
        <SurveyShellAside title={title} description={schema.description} />
        <SurveyShellMain>
          <div className="space-y-4 text-center">
            <h1 className="text-5xl">😭</h1>
            <p className="text-muted-foreground">
              There are no questions in this survey. Add questions to see a
              preview
            </p>
          </div>
        </SurveyShellMain>
      </SurveyShell>
    );
  }

  return (
    <SurveyShell>
      <SurveyShellAside title={title} description={schema.description} />
      <SurveyShellMain>
        <SurveyForm shouldSubmitResults={false} schema={schema} surveyId={id} />
      </SurveyShellMain>
    </SurveyShell>
  );
};
