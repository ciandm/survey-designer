'use client';

import React from 'react';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {useLoadingOverlayTrigger} from '@/components/loading-overlay';
import {useDuplicateSurvey} from '@/features/survey-designer/hooks/use-duplicate-survey';
import {getSiteUrl} from '@/lib/hrefs';
import {SurveyResponse} from '@/lib/validations/survey';

type PreviousSurveyContainerProps = {
  children: React.ReactNode;
  survey: SurveyResponse['survey'];
};

const overlayContent = (
  <div className="flex h-full flex-col items-center justify-center gap-4">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <p className="text-base font-medium">Duplicating survey...</p>
  </div>
);

export const PreviousSurveyContainer = ({
  children,
  survey,
}: PreviousSurveyContainerProps) => {
  const {handleHideOverlay, handleOpenOverlay} = useLoadingOverlayTrigger();
  const {mutateAsync: handleDuplicateSurvey} = useDuplicateSurvey();
  const router = useRouter();

  const onClick = async () => {
    handleOpenOverlay({content: overlayContent}).then(async () => {
      try {
        const {survey: duplicatedSurvey} = await handleDuplicateSurvey({
          surveyId: survey.id,
        });
        toast.success('Survey duplicated', {
          position: 'bottom-center',
        });
        router.push(getSiteUrl.designerPage({surveyId: duplicatedSurvey.id}));
        handleHideOverlay();
      } catch (error) {
        console.error(error);
      }
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
