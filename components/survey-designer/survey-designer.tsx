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
  useActiveField,
  useSurveyFieldActions,
  useSurveyQuestions,
} from '../survey-schema-initiailiser';
import {Input} from '../ui/input';
import {Separator} from '../ui/separator';
import {AddQuestionButton} from './_components/add-question-button';
import {
  QuestionItem,
  QuestionItemMenu,
  QuestionSidebar,
} from './_components/question-sidebar';

export const SurveyDesigner = () => {
  const questions = useSurveyQuestions();
  const {activeField} = useActiveField();
  const {
    updateQuestion,
    insertQuestion,
    deleteQuestion,
    duplicateQuestion,
    setActiveQuestionRef: setActiveQuestionRef,
  } = useSurveyFieldActions();

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
      <QuestionSidebar
        addQuestionComponent={
          <AddQuestionButton
            onClick={() => insertQuestion({type: 'LONG_TEXT'})}
          />
        }
      >
        {({fixedField, setFixedField}) => (
          <>
            {questions.map((field, index) => (
              <QuestionItem
                key={field.id}
                index={index}
                isSelected={field.id === activeField?.id}
                type={field.type}
                onClick={() => {
                  if (fixedField) return;
                  setActiveQuestionRef(field.ref);
                }}
                menu={
                  <QuestionItemMenu
                    fieldRef={field.ref}
                    fixedField={fixedField}
                    setFixedField={setFixedField}
                    onDelete={() => deleteQuestion({id: field.id})}
                    onDuplicate={() => duplicateQuestion({id: field.id})}
                  />
                }
              >
                {field.text || '...'}
              </QuestionItem>
            ))}
          </>
        )}
      </QuestionSidebar>
      <div className="flex w-full items-center justify-center bg-slate-50 p-4">
        {activeField && (
          <QuestionDesigner>
            <Input
              placeholder="Your question here..."
              value={activeField.text || ''}
              onChange={(e) =>
                updateQuestion({id: activeField.id, text: e.target.value})
              }
            />
            <Input
              className="mt-4"
              placeholder="Description (optional)"
              value={activeField.description || ''}
              onChange={(e) =>
                updateQuestion({
                  id: activeField.id,
                  description: e.target.value,
                })
              }
            />
            <Separator className="my-8" />
            {renderQuestionTypeOption(activeField.type)}
          </QuestionDesigner>
        )}
      </div>
      {activeField && (
        <aside
          className="w-[480px] border-l"
          key={activeField ? activeField.id : null}
        >
          <QuestionTypeOption />
          <QuestionSettings />
        </aside>
      )}
    </>
  );
};
