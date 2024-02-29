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
    const initialData = {
      title: `${survey.schema.title} (copy)`,
      description: survey.schema.description,
      id: survey.id,
    };
    handleTriggerDuplicateSurveyDialog({
      initialData,
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
