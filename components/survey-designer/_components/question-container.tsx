'use client';

import {
  useActiveQuestion,
  useSurveyQuestions,
} from '../../survey-schema-initiailiser';

export const QuestionContainer = ({children}: {children: React.ReactNode}) => {
  const {activeQuestionIndex} = useActiveQuestion();
  const questions = useSurveyQuestions();

  return (
    <div className="flex w-full flex-col items-start self-start p-4">
      <div className="flex justify-between">
        <p className="mb-2 text-sm text-muted-foreground">
          Question {activeQuestionIndex + 1} of {questions.length}
        </p>
      </div>
      {children}
    </div>
  );
};
