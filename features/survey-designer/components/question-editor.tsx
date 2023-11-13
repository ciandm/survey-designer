'use client';

import {QuestionProvider} from '@/features/survey-tool/components/question-provider';
import {ResponseField} from '@/features/survey-tool/components/response-field';
import {Question} from '../../survey-tool/components/question';
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
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-card p-8 shadow-lg">
          <div className="w-full max-w-xl">
            <QuestionProvider
              question={activeQuestion}
              questionNumber={activeQuestionIndex + 1}
              totalQuestions={questions.length}
              view="editing"
            >
              <Question
                onTitleChange={(value) =>
                  updateQuestion({id: activeQuestion.id, text: value})
                }
                onDescriptionChange={(value) =>
                  updateQuestion({id: activeQuestion.id, description: value})
                }
              />
              <ResponseField />
            </QuestionProvider>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Click on a question to edit</p>
      )}
    </div>
  );
};
