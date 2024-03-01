import React from 'react';
import {cn} from '@/lib/utils';

type SurveyShellProps = {
  children: React.ReactNode;
};

export const SurveyShell = ({children}: SurveyShellProps) => {
  return (
    <div className="flex flex-1 flex-col items-stretch md:flex-row">
      {children}
    </div>
  );
};

type SurveyShellAsideProps = {
  className?: string;
  title: string;
  description?: string;
};

export const SurveyShellAside = ({
  className,
  title,
  description,
}: SurveyShellAsideProps) => {
  return (
    <aside
      className={cn(
        'relative flex shrink-0 flex-col justify-center space-y-1 border-b bg-muted bg-white px-4 py-8 sm:border-r md:sticky md:bottom-0 md:top-14 md:flex md:h-[calc(100vh-56px)] md:w-44 md:max-w-[320px] md:flex-1 md:flex-col md:items-start md:border-b-0 md:p-8 lg:max-w-[380px]',
        className,
      )}
    >
      <h1 className="mb-2 text-xl font-bold leading-4 tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
    </aside>
  );
};

export const SurveyShellMain = ({children}: {children: React.ReactNode}) => {
  return (
    <section className="flex w-full flex-1 bg-muted p-4 md:mx-auto md:items-center md:justify-center md:p-12 lg:p-24 xl:p-32">
      <div className="mx-auto w-full md:max-w-2xl">{children}</div>
    </section>
  );
};
