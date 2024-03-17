import {useEffect, useRef, useState} from 'react';
import {useDesignerStoreActions} from '@/features/survey-designer/store/designer-store';
import {ChoicesSchema} from '@/types/field';

type UseChoicesProps = {
  choices: ChoicesSchema;
  fieldId: string;
};

export const useChoices = ({fieldId, choices = []}: UseChoicesProps) => {
  const storeActions = useDesignerStoreActions();
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const focusInputs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (focusIndex !== null) {
      focusInputs.current[focusIndex]?.focus();
      setFocusIndex(null);
    }
  }, [focusIndex]);

  const handleInsertChoice = () => {
    storeActions.choices.insertChoice(fieldId);
    setFocusIndex(choices.length);
  };

  const handleRemoveChoice = (choiceId: string) => {
    storeActions.choices.deleteChoice(fieldId, {choiceId});
    setFocusIndex(choices.length - 2);
  };

  const handleRemoveAll = () => {
    storeActions.choices.deleteChoices(fieldId);
    setFocusIndex(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value !== '') {
      e.preventDefault();
      setFocusIndex(choices.length);
      storeActions.choices.insertChoice(fieldId);
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
