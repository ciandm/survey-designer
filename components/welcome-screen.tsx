import React from 'react';

type WelcomeScreenProps = {
  message: string | null;
  children: React.ReactNode;
};

export const WelcomeScreen = ({message, children}: WelcomeScreenProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-5xl">👋</h1>
      <p className="text-muted-foreground">
        {message || 'Welcome to the survey'}
      </p>
      {children}
    </div>
  );
};
