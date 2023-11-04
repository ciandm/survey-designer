'use client';

import {QuestionType} from '@prisma/client';
import {
  QuestionSettings,
  QuestionTypeOption,
} from '../question-designer/components/question-options';
import {
  ChoicesQuestion,
  QuestionDesigner,
  TextQuestion,
} from '../question-designer/question-designer';
import {
  useActiveQuestion,
  useSurveyFieldActions,
} from '../survey-schema-initiailiser';
import {Input} from '../ui/input';
import {Separator} from '../ui/separator';
import {QuestionSidebar} from './_components/question-sidebar';

export const SurveyDesigner = () => {
  const {activeQuestion} = useActiveQuestion();
  const {updateQuestion} = useSurveyFieldActions();

  const renderQuestionTypeOption = (type: QuestionType) => {
    switch (type) {
      case 'LONG_TEXT':
      case 'SHORT_TEXT':
        return <TextQuestion />;
      case 'MULTIPLE_CHOICE':
      case 'SINGLE_CHOICE':
        return <ChoicesQuestion />;
    }
  };

  return (
    <>
      <QuestionSidebar />
      <div className="flex w-full items-center justify-center bg-slate-50 p-4">
        {activeQuestion && (
          <QuestionDesigner>
            <Input
              placeholder="Your question here..."
              value={activeQuestion.text || ''}
              onChange={(e) =>
                updateQuestion({id: activeQuestion.id, text: e.target.value})
              }
            />
            <Input
              className="mt-4"
              placeholder="Description (optional)"
              value={activeQuestion.description || ''}
              onChange={(e) =>
                updateQuestion({
                  id: activeQuestion.id,
                  description: e.target.value,
                })
              }
            />
            <Separator className="my-8" />
            {renderQuestionTypeOption(activeQuestion.type)}
          </QuestionDesigner>
        )}
      </div>
      {activeQuestion && (
        <aside
          className="w-[480px] border-l"
          key={activeQuestion ? activeQuestion.id : null}
        >
          <QuestionTypeOption />
          <QuestionSettings />
        </aside>
      )}
    </>
  );
};
