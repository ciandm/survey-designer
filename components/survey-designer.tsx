'use client';

import {Prisma} from '@prisma/client';
import QuestionsContainer from './questions-container';
import {QuestionsPanel} from './questions-panel';

export const SurveyDesigner = ({
  survey,
}: {
  survey: Prisma.SurveyGetPayload<{include: {questions: true}}>;
}) => {
  return (
    <QuestionsContainer questions={survey.questions}>
      <aside className="w-[320px] border-r p-4">
        Question suggestion selector goes here
      </aside>
      <div className="flex w-full flex-col space-y-2">
        <QuestionsPanel />
      </div>
      <aside className="w-[480px] border-l" id="options-playground" />
    </QuestionsContainer>
  );
};
