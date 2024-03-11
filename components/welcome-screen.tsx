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
    <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-2xl font-semibold">
        {title || 'Welcome to the survey'}
      </h1>
      <p className="text-muted-foreground">
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
