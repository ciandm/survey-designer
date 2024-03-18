'use client';

import React from 'react';
import {ChatBubbleOvalLeftEllipsisIcon} from '@heroicons/react/20/solid';
import {Loader2} from 'lucide-react';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Button} from '@/components/ui';
import {publishSurveyAction} from '@/features/survey-designer/actions/publish-survey';
import {CopySurveyUrl} from '@/features/survey-designer/components/copy-survey-url';
import {
  useDesignerStoreActions,
  useDesignerStoreIsPublished,
  useDesignerStoreSurveyId,
} from '@/features/survey-designer/store/designer-store';

export const ResponsesEmptyState = () => {
  const isPublished = useDesignerStoreIsPublished();
  const id = useDesignerStoreSurveyId();
  const storeActions = useDesignerStoreActions();

  const {execute: handlePublishSurvey, status} = useAction(
    publishSurveyAction,
    {
      onSuccess: () => {
        toast('Survey published 🥳', {
          description:
            'You can now share your survey to start collecting responses.',
          position: 'bottom-center',
        });
        storeActions.survey.setPublished(true);
      },
    },
  );

  return (
    <div className="relative flex w-full flex-1 items-center justify-center bg-muted bg-dot-black/[0.2] dark:bg-black dark:bg-dot-white/[0.2]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black" />
      <div className="container max-w-xl">
        <div className="text-center">
          <ChatBubbleOvalLeftEllipsisIcon className="mx-auto h-10 w-10" />
          <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
            No responses yet
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Responses will appear here once people start taking your survey.{' '}
            {isPublished
              ? ' Share your survey to start collecting responses.'
              : 'You need to publish your survey to start collecting responses.'}
          </p>
        </div>
        <div className="mt-8 flex">
          {isPublished ? (
            <CopySurveyUrl className="flex-1" />
          ) : (
            <Button
              disabled={status === 'executing'}
              onClick={() =>
                handlePublishSurvey({action: 'publish', surveyId: id})
              }
              className="mx-auto"
            >
              Publish survey
              {status === 'executing' && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
