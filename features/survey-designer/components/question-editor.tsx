'use client';

import {QuestionOverflowWrapper} from '@/components/question-overflow-wrapper';
import {QuestionProvider} from '@/features/survey-tool/components/question-provider';
import {ResponseField} from '@/features/survey-tool/components/response-field';
import {Question} from '../../survey-tool/components/question';
import {useActiveQuestion} from '../hooks/use-active-question';
import {updateQuestion, useSurveyQuestions} from '../store/survey-designer';

export const QuestionEditor = () => {
  const questions = useSurveyQuestions();
  const {activeQuestion, activeQuestionIndex} = useActiveQuestion();

  return (
    <div className="flex h-full w-full flex-1 bg-muted px-4 py-24">
      {activeQuestion ? (
        <QuestionOverflowWrapper className="w-full bg-card shadow-lg">
          <div className="mx-auto my-auto flex min-h-0 w-full max-w-lg flex-col py-16">
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
        </QuestionOverflowWrapper>
      ) : (
        <p className="text-center text-gray-500">Click on a question to edit</p>
      )}
    </div>
  );
};
