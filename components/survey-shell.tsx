import React from 'react';
import {ParsedModelType} from '@/types/survey';
import {cn} from '@/utils/classnames';

type SurveyShellProps = {
  children: React.ReactNode;
  className?: string;
};

export const SurveyShell = ({children, className}: SurveyShellProps) => {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-stretch md:flex-row ',
        className,
      )}
    >
      {children}
    </div>
  );
};

type SurveyShellAsideProps = {
  className?: string;
  model: ParsedModelType;
};

export const SurveyShellAside = ({className, model}: SurveyShellAsideProps) => {
  const {description} = model;
  const title = !!model.title ? model.title : 'Untitled Survey';
  return (
    <aside
      className={cn(
        'relative flex shrink-0 flex-col space-y-1 border-b bg-muted bg-white px-4 py-8 sm:border-r md:sticky md:bottom-0 md:flex md:w-44 md:max-w-[320px] md:flex-1 md:flex-col md:items-start md:border-b-0 md:px-8 md:py-12 lg:max-w-[380px] lg:py-24 xl:py-32',
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
    <section className="flex w-full flex-1 bg-muted p-4 md:mx-auto md:p-12 lg:p-24 xl:p-32">
      <div className="mx-auto flex w-full md:max-w-2xl">{children}</div>
    </section>
  );
};
