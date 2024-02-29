'use client';

import React from 'react';
import {useDuplicateSurveyFormTrigger} from '@/components/duplicate-survey-dialog';
import {SurveyResponse} from '@/lib/validations/survey';

type PreviousSurveyContainerProps = {
  children: React.ReactNode;
  survey: SurveyResponse['survey'];
};

export const PreviousSurveyContainer = ({
  children,
  survey,
}: PreviousSurveyContainerProps) => {
  const {handleTriggerDuplicateSurveyDialog} = useDuplicateSurveyFormTrigger();

  const handleClick = async () => {
    handleTriggerDuplicateSurveyDialog({
      initialData: {
        title: survey.schema.title,
        id: survey.id,
        description: survey.schema.description,
      },
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex cursor-pointer flex-col justify-between gap-0.5 border-t px-5 py-6 text-left transition-colors first:border-t-0 hover:bg-muted sm:flex-row sm:gap-2"
    >
      {children}
    </button>
  );
};
