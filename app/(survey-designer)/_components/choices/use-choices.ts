import {useEffect, useRef, useState} from 'react';
import {useSurveyStoreActions} from '@/survey-designer/_store/survey-designer-store';
import {ChoicesSchema} from '@/types/element';

type UseChoicesProps = {
  choices: ChoicesSchema;
  elementId: string;
};

export const useChoices = ({elementId, choices = []}: UseChoicesProps) => {
  const {insertQuestionChoice, deleteQuestionChoice, deleteChoices} =
    useSurveyStoreActions();
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const focusInputs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (focusIndex !== null) {
      focusInputs.current[focusIndex]?.focus();
      setFocusIndex(null);
    }
  }, [focusIndex]);

  const handleInsertChoice = () => {
    insertQuestionChoice({elementId});
    setFocusIndex(choices.length);
  };

  const handleRemoveChoice = (choiceId: string) => {
    deleteQuestionChoice({elementId, choiceId});
    setFocusIndex(choices.length - 2);
  };

  const handleRemoveAll = () => {
    deleteChoices({elementId});
    setFocusIndex(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value !== '') {
      e.preventDefault();
      setFocusIndex(choices.length);
      insertQuestionChoice({elementId});
    }
  };

  const isAddChoiceDisabled = choices.some((choice) => choice.value === '');

  return {
    handlers: {
      handleInsertChoice,
      handleRemoveChoice,
      handleInputKeyDown,
      handleRemoveAll,
    },
    focus: {
      focusIndex,
      setFocusIndex,
      focusInputs,
    },
    isAddChoiceDisabled,
  };
};
