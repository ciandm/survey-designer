import React from 'react';
import {Button, ButtonProps} from '@/components/ui/button';
import {useChoicesContext} from './choices.context';
import {isAddChoiceDisabled} from './choices.utils';

export const AddChoiceButton = React.forwardRef<
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
      onClick={handleInsertChoice}
      {...rest}
    >
      {children}
    </Button>
  );
});

AddChoiceButton.displayName = 'AddChoiceButton';
