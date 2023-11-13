'use client';

import {QuestionCard} from '@/features/survey-tool/components/question-card';
import {QuestionChoices} from '@/features/survey-tool/components/question-choices';
import {QuestionWording} from '../../survey-tool/components/question-wording';
import {useActiveQuestion} from '../hooks/use-active-question';
import {
  useSurveyQuestions,
  useSurveyQuestionsActions,
} from '../store/survey-designer';

export const QuestionEditor = () => {
  const questions = useSurveyQuestions();
  const {activeQuestion, activeQuestionIndex} = useActiveQuestion();
  const {updateQuestion} = useSurveyQuestionsActions();

  return (
    <div className="flex w-full flex-1 overflow-y-auto bg-muted px-4 py-32">
      {activeQuestion ? (
        <div className="flex w-full flex-col items-center justify-center bg-card p-8">
          <div className="w-full max-w-xl">
            <QuestionWording
              question={activeQuestion}
              questionNumber={activeQuestionIndex + 1}
              totalQuestions={questions.length}
              view="editing"
              onTitleChange={(value) =>
                updateQuestion({id: activeQuestion.id, text: value})
              }
              onDescriptionChange={(value) =>
                updateQuestion({id: activeQuestion.id, description: value})
              }
            />
            <QuestionChoices question={activeQuestion} view="editing" />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Click on a question to edit</p>
      )}
    </div>
  );
};
