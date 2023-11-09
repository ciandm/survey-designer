'use client';

import {QuestionCard} from '@/features/survey-tool/components/question-card';
import {QuestionChoices} from '@/features/survey-tool/components/question-choices';
import {QuestionWording} from '../../survey-tool/components/question-wording';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useQuestionActions, useQuestions} from '../store/questions';

export const QuestionEditor = () => {
  const questions = useQuestions();
  const {activeQuestion, activeQuestionIndex} = useActiveQuestion();
  const {updateQuestion} = useQuestionActions();

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
            onTitleChange={(value) =>
              updateQuestion({id: activeQuestion.id, text: value})
            }
            onDescriptionChange={(value) =>
              updateQuestion({id: activeQuestion.id, description: value})
            }
          />
          <QuestionChoices />
        </QuestionCard>
      ) : (
        <p className="text-center text-gray-500">Click on a question to edit</p>
      )}
    </div>
  );
};
