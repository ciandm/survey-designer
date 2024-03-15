import React from 'react';
import {Button, ButtonProps} from '@/components/ui/button';
import {useChoicesContext} from '../choices.context';
import {isRemoveAllDisabled} from '../choices.utils';

export const ChoicesRemoveAll = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'onClick'>
>(({children, ...rest}, ref) => {
  const {
    handlers: {handleRemoveAll},
    choices,
  } = useChoicesContext();

  return (
    <Button
      disabled={isRemoveAllDisabled(choices)}
      ref={ref}
      {...rest}
      onClick={handleRemoveAll}
    >
      {children}
    </Button>
  );
});

ChoicesRemoveAll.displayName = 'RemoveAllChoicesButton';
