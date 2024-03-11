import React from 'react';

type WelcomeScreenProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export const WelcomeScreen = ({
  title,
  description,
  children,
}: WelcomeScreenProps) => {
  return (
    <div className="flex flex-1 flex-col items-center space-y-4 text-center">
      <h1 className="text-5xl">👋</h1>
      <p className="text-muted-foreground">
        {title || 'Welcome to the survey'}
        {description && (
          <span className="mt-2 block text-base text-muted-foreground">
            {description}
          </span>
        )}
      </p>
      {children}
    </div>
  );
};
