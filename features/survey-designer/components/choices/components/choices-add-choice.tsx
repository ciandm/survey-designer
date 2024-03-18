import React from 'react';
import {Button, ButtonProps} from '@/components/ui';
import {useChoicesContext} from '../choices.context';
import {isAddChoiceDisabled} from '../choices.utils';

export const ChoicesAddChoice = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'onClick'>
>(({children, asChild, ...rest}, ref) => {
  const {
    handlers: {handleInsertChoice},
    choices,
  } = useChoicesContext();

  return (
    <Button
      disabled={isAddChoiceDisabled(choices)}
      ref={ref}
      {...rest}
      onClick={handleInsertChoice}
    >
      {children}
    </Button>
  );
});

ChoicesAddChoice.displayName = 'AddChoiceButton';
