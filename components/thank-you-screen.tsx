import React from 'react';
import {CheckCircleIcon} from '@heroicons/react/20/solid';

type ThankYouScreenProps = {
  title?: string;
  description?: string | null;
  children?: React.ReactNode;
};

export const ThankYouScreen = ({
  title,
  description,
  children,
}: ThankYouScreenProps) => {
  return (
    <div className="mx-auto flex">
      <div className="container flex max-w-lg flex-col items-center gap-4">
        <CheckCircleIcon className="h-12 w-12 text-green-500" />
        <div className="space-y-3 text-center">
          <p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            {title || 'Thank you!'}
          </p>
          <p className="text-lg leading-8 text-gray-600">
            {description || 'Your response has been submitted.'}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
