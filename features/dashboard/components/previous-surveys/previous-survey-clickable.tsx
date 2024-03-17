'use client';

import React from 'react';
import {DuplicateSurveyDialog} from '@/components/duplicate-survey-dialog/duplicate-survey-dialog';
import {useSurveyDialog} from '@/features/survey-designer/hooks/use-survey-dialog';
import {SurveyWithParsedModelType} from '@/types/survey';

type PreviousSurveyClickableProps = {
  children: React.ReactNode;
  survey: SurveyWithParsedModelType;
};

export const PreviousSurveyClickable = ({
  children,
  survey,
}: PreviousSurveyClickableProps) => {
  const {
    handleTriggerDuplicateDialog,
    state: {duplicateDialogOptions},
    dispatch,
  } = useSurveyDialog();

  return (
    <>
      <button
        onClick={() =>
          handleTriggerDuplicateDialog({
            id: survey.id,
            title: survey.model.title ?? '',
          })
        }
        className="flex cursor-pointer flex-col justify-between gap-0.5 border-t px-5 py-6 text-left transition-colors first:border-t-0 hover:bg-muted sm:flex-row sm:gap-2"
      >
        {children}
      </button>
      <DuplicateSurveyDialog
        key={duplicateDialogOptions.data?.id}
        isOpen={duplicateDialogOptions.isOpen}
        onOpenChange={(isOpen) =>
          dispatch({type: 'TOGGLE_DIALOG', payload: {isOpen, key: 'duplicate'}})
        }
        data={duplicateDialogOptions.data ?? {}}
      />
    </>
  );
};
