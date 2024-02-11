'use client';

import {useSurveyProvider} from '@/components/survey-provider';
import {SurveyResponseSchema} from '@/lib/validations/survey';

export const Response = ({response}: {response: SurveyResponseSchema}) => {
  const {survey} = useSurveyProvider();

  return (
    <div className="flex w-full flex-1 flex-col bg-card p-4">
      {survey.questions.map((question) => {
        const r = response.responses.find((r) => r.questionId === question.id);
        return (
          <div key={question.id} className="mb-4 flex flex-col">
            <div className="text-lg font-bold">
              {!!question.text ? question.text : 'Untitled question'}
            </div>
            <div className="mt-2">
              {r?.value.map((v) => <div key={v}>{v}</div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
