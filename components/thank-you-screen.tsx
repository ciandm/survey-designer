import React from 'react';
import {CheckCircleIcon} from '@heroicons/react/20/solid';

type ThankYouScreenProps = {
  message: string | null;
  children?: React.ReactNode;
};

export const ThankYouScreen = ({message, children}: ThankYouScreenProps) => {
  return (
    <div className="flex bg-muted">
      <div className="container my-auto flex max-w-lg flex-col items-center gap-6">
        <CheckCircleIcon className="h-16 w-16 text-green-500" />
        <div className="space-y-3 text-center">
          <p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Thank you!
          </p>
          <p className="text-lg leading-8 text-gray-600">
            {message || 'Your response has been submitted.'}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
