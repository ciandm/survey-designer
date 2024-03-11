import React, {useMemo} from 'react';
import {ChoicesSchema} from '@/types/element';
import {ChoicesContextProvider} from './choices.context';
import {useChoices} from './use-choices';

type ChoicesProps = {
  children: React.ReactNode;
  choices?: ChoicesSchema;
  elementId: string;
};

export const Choices = ({children, choices = [], elementId}: ChoicesProps) => {
  const {handlers, focus, isAddChoiceDisabled} = useChoices({
    choices,
    elementId,
  });

  const value = useMemo(
    () => ({
      focus,
      handlers,
      isAddChoiceDisabled,
      choices,
      elementId,
    }),
    [focus, handlers, isAddChoiceDisabled, choices, elementId],
  );

  return (
    <ChoicesContextProvider value={value}>{children}</ChoicesContextProvider>
  );
};
