'use client';

import {QuestionType} from '@prisma/client';
import {QuestionCard} from '@/features/question/components/question-card';
import {QuestionChoices} from '@/features/question/components/question-choices';
import {ChoicesQuestionAddon} from '@/features/survey-designer/components/choices-question-addon';
import {
  useSurveyFieldActions,
  useSurveyQuestions,
} from '@/stores/survey-schema';
import {QuestionWording} from '../../question/components/question-wording';
import {TextField} from '../../question/components/text-field';
import {useActiveQuestion} from '../hooks/use-active-question';

export const QuestionEditor = () => {
  const questions = useSurveyQuestions();
  const {activeQuestion, activeQuestionIndex} = useActiveQuestion();
  const {updateTitle, updateDescription} = useSurveyFieldActions();

  return (
    <div className="flex w-full flex-1 overflow-y-auto bg-primary-foreground p-8">
      {activeQuestion ? (
        <QuestionCard
          question={activeQuestion}
          totalQuestions={questions.length}
          questionNumber={activeQuestionIndex + 1}
          view="editing"
        >
          <QuestionWording
            onTitleChange={updateTitle}
            onDescriptionChange={updateDescription}
          />
          <QuestionChoices />
        </QuestionCard>
      ) : (
        <p className="text-center text-gray-500">Click on a question to edit</p>
      )}
    </div>
  );
};
