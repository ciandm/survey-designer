'use client';

import React from 'react';
import {useDuplicateSurveyFormTrigger} from '@/components/duplicate-survey-dialog';
import {SurveyWithParsedModelType} from '@/types/survey';

type PreviousSurveyContainerProps = {
  children: React.ReactNode;
  survey: SurveyWithParsedModelType;
};

export const PreviousSurveyContainer = ({
  children,
  survey,
}: PreviousSurveyContainerProps) => {
  const {handleTriggerDuplicateSurveyDialog} = useDuplicateSurveyFormTrigger();

  const handleClick = async () => {
    const initialData = {
      title: `${survey.model.title} (copy)`,
      description: survey.model.description,
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
