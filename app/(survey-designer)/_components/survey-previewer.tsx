'use client';

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
    <div className="flex h-full flex-col overflow-hidden sm:flex-1 sm:flex-row">
      <aside className="mb-2 flex flex-col items-start justify-center space-y-1 border-b bg-white px-4 py-8 leading-3 tracking-tight sm:mb-0 sm:max-w-[320px] sm:flex-1 sm:border-b-0 sm:border-r sm:p-8 md:max-w-[350px]">
        <h1 className="mb-1 text-2xl font-bold">{schema.title}</h1>
        <p className="text-sm text-muted-foreground">{schema.description}</p>
      </aside>
      <section className="flex w-full flex-1 overflow-y-auto sm:mx-auto sm:items-center sm:justify-center">
        <div className="flex h-full w-full max-w-4xl flex-1 p-16">
          <div className="h-full">
            <SurveyForm
              shouldSubmitResults={false}
              schema={schema}
              surveyId={id}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
