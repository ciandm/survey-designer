import React, {useMemo} from 'react';
import {ChoicesSchema} from '@/types/field';
import {useChoices} from './hooks/use-choices';
import {ChoicesContextProvider} from './choices.context';

type ChoicesProps = {
  children: React.ReactNode;
  choices?: ChoicesSchema;
  fieldId: string;
};

export const Choices = ({children, choices = [], fieldId}: ChoicesProps) => {
  const {handlers, focus, isAddChoiceDisabled} = useChoices({
    choices,
    fieldId,
  });

  const value = useMemo(
    () => ({
      focus,
      handlers,
      isAddChoiceDisabled,
      choices,
      fieldId,
    }),
    [focus, handlers, isAddChoiceDisabled, choices, fieldId],
  );

  return (
    <ChoicesContextProvider value={value}>{children}</ChoicesContextProvider>
  );
};
