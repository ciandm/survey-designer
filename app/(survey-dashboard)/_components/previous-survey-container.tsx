'use client';

import React from 'react';
import {Loader2} from 'lucide-react';
import {useDuplicateSurveyFormTrigger} from '@/components/duplicate-form';
import {SurveyResponse} from '@/lib/validations/survey';

type PreviousSurveyContainerProps = {
  children: React.ReactNode;
  survey: SurveyResponse['survey'];
};

export const PreviousSurveyContainer = ({
  children,
  survey,
}: PreviousSurveyContainerProps) => {
  const triggerDuplicateSurveyForm = useDuplicateSurveyFormTrigger();

  const onClick = async () => {
    triggerDuplicateSurveyForm({
      initialData: {
        title: `${survey.schema.title} (copy)`,
        id: survey.id,
        description: survey.schema.description,
      },
    });
  };

  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer flex-col justify-between gap-0.5 border-t px-5 py-6 text-left transition-colors first:border-t-0 hover:bg-muted sm:flex-row sm:gap-2"
    >
      {children}
    </button>
  );
};
