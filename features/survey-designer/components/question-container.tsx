'use client';

import {Card} from '@/components/ui/card';
import {useSurveyQuestions} from '@/stores/survey-schema';
import {useActiveQuestion} from '../hooks/use-active-question';

export const QuestionContainer = ({children}: {children: React.ReactNode}) => {
  const {activeQuestionIndex} = useActiveQuestion();
  const questions = useSurveyQuestions();

  return (
    <Card className="flex w-full flex-col items-center justify-center rounded-none">
      <div className="flex w-full flex-col items-center justify-center py-16">
        <div className="w-full flex-1 px-32">
          <p className="mb-2 text-sm text-muted-foreground">
            Question {activeQuestionIndex + 1} of {questions.length}
          </p>
          <div className="flex flex-col">{children}</div>
        </div>
      </div>
    </Card>
  );
};