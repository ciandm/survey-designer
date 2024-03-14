import React from 'react';
import {ScreenSchema} from '@/types/screen';

type ScreenElementProps = {
  screen?: ScreenSchema;
  children?: React.ReactNode;
};

export const ScreenElement = ({screen, children}: ScreenElementProps) => {
  const {text, description} = screen ?? {};

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center p-4 text-center">
      <div className="flex flex-col gap-2">
        {text && <h1 className="text-2xl font-medium">{text}</h1>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};
