import React from 'react';
import {QuestionType} from '@prisma/client';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useActiveQuestion, useSurveyFieldActions} from '@/stores/survey-schema';

export const TextQuestionAddon = () => {
  const {activeQuestion} = useActiveQuestion();
  const {updateQuestion} = useSurveyFieldActions();

  const InputComponent =
    activeQuestion?.type === QuestionType.SHORT_TEXT ? Input : Textarea;

  return (
    <InputComponent
      type="text"
      name="name"
      id="name"
      placeholder={
        !!activeQuestion?.properties.placeholder
          ? activeQuestion.properties.placeholder
          : 'Your answer here...'
      }
      onChange={(e) =>
        updateQuestion({
          id: activeQuestion?.id ?? '',
          properties: {placeholder: e.target.value},
        })
      }
      readOnly
    />
  );
};
