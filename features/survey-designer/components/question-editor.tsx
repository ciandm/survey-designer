'use client';

import {QuestionType} from '@prisma/client';
import {useActiveQuestion, useSurveyFieldActions} from '@/stores/survey-schema';
import {Separator} from '@/components/ui/separator';
import {ChoicesQuestionAddon} from '@/features/survey-designer/components/choices-question-addon';
import {cn} from '@/lib/utils';
import {ContentEditable} from './content-editable';
import {QuestionContainer} from './question-container';
import {TextQuestionAddon} from './text-question-addon';

export const QuestionEditor = () => {
  const {activeQuestion} = useActiveQuestion();
  const {updateQuestion} = useSurveyFieldActions();

  const renderQuestionTypeOption = (type: QuestionType) => {
    switch (type) {
      case 'LONG_TEXT':
      case 'SHORT_TEXT':
        return <TextQuestionAddon />;
      case 'MULTIPLE_CHOICE':
      case 'SINGLE_CHOICE':
        return <ChoicesQuestionAddon />;
    }
  };

  return (
    <div className="flex w-full flex-1 overflow-y-auto bg-slate-50 p-8">
      {activeQuestion ? (
        <QuestionContainer>
          <ContentEditable
            className={cn('text-2xl font-bold', {
              [`after:content-['*']`]: activeQuestion?.validations?.required,
            })}
            placeholder="Begin typing your question here..."
            html={activeQuestion.text ?? ''}
            onChange={(e) =>
              updateQuestion({id: activeQuestion.id, text: e.target.value})
            }
          />
          <ContentEditable
            className="mt-2"
            placeholder="Description (optional)"
            html={activeQuestion.description ?? ''}
            onChange={(e) =>
              updateQuestion({
                id: activeQuestion.id,
                description: e.target.value,
              })
            }
          />
          <Separator className="my-8" />
          {renderQuestionTypeOption(activeQuestion.type)}
        </QuestionContainer>
      ) : (
        <p className="text-center text-gray-500">Click on a question to edit</p>
      )}
    </div>
  );
};
