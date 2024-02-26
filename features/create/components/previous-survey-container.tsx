'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {useDuplicateSurvey} from '@/features/survey-designer/hooks/use-duplicate-survey';
import {siteUrls} from '@/lib/hrefs';
import {SurveyResponse} from '@/lib/validations/survey';
import {useDuplicatePreviousPopup} from './duplicate-previous-popup';

type PreviousSurveyContainerProps = {
  children: React.ReactNode;
  survey: SurveyResponse['survey'];
};

export const PreviousSurveyContainer = ({
  children,
  survey,
}: PreviousSurveyContainerProps) => {
  const {setOpen} = useDuplicatePreviousPopup();
  const {mutateAsync: handleDuplicateSurvey} = useDuplicateSurvey();
  const router = useRouter();

  const onClick = async () => {
    try {
      setOpen(true);
      const {survey: duplicatedSurvey} = await handleDuplicateSurvey({
        surveyId: survey.id,
      });
      router.push(siteUrls.designerPage({surveyId: duplicatedSurvey.id}));
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
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
