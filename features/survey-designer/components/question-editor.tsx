'use client';

import {QuestionType} from '@prisma/client';
import {Card} from '@/components/ui/card';
import {ChoicesQuestionAddon} from '@/features/survey-designer/components/choices-question-addon';
import {useSurveyQuestions} from '@/stores/survey-schema';
import {useActiveQuestion} from '../hooks/use-active-question';
import {QuestionWording} from './question-wording';
import {TextField} from './text-field';

export const QuestionEditor = () => {
  const questions = useSurveyQuestions();
  const {activeQuestion, activeQuestionIndex} = useActiveQuestion();

  const renderQuestionTypeOption = (type: QuestionType) => {
    switch (type) {
      case 'SHORT_TEXT':
      case 'LONG_TEXT':
        return <TextField type={type} question={activeQuestion!} />;
      case 'MULTIPLE_CHOICE':
      case 'SINGLE_CHOICE':
        return <ChoicesQuestionAddon />;
    }
  };

  return (
    <div className="flex w-full flex-1 overflow-y-auto bg-primary-foreground p-8">
      {activeQuestion ? (
        <Card className="flex w-full flex-col items-center justify-center rounded-none">
          <div className="flex w-full flex-col items-center justify-center py-16">
            <div className="w-full flex-1 px-32">
              <QuestionWording
                questionNumber={activeQuestionIndex + 1}
                totalQuestions={questions.length}
                question={activeQuestion}
                view="editable"
              />
              {renderQuestionTypeOption(activeQuestion.type)}
            </div>
          </div>
        </Card>
      ) : (
        <p className="text-center text-gray-500">Click on a question to edit</p>
      )}
    </div>
  );
};
