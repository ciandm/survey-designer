import React, {useId} from 'react';
import {Label} from '@/components/ui/label';
import {SettingsInputContextProvider} from './settings-field.context';
import {useSettingsInputContext} from './settings-field.context';

type SettingsFieldProps = {
  children: React.ReactNode | (({id}: {id: string}) => React.ReactNode);
};

export const SettingsField = ({children}: SettingsFieldProps) => {
  const id = useId();

  return (
    <SettingsInputContextProvider value={{id}}>
      <div className="space-y-1.5">
        {typeof children === 'function' ? children({id}) : children}
      </div>
    </SettingsInputContextProvider>
  );
};

export const SettingsFieldInputWrapper = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const {id} = useSettingsInputContext();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const Component = React.cloneElement(children, {
    id,
    name: id,
    onKeyDown: handleKeyDown,
  });

  return Component;
};

export const SettingsFieldLabel = ({children}: {children: React.ReactNode}) => {
  const {id} = useSettingsInputContext();

  return <Label htmlFor={id}>{children}</Label>;
};
