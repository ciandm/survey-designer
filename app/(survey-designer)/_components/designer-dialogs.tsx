import React from 'react';
import {DeleteSurveyDialog} from '@/components/delete-survey-dialog';
import {DuplicateSurveyDialog} from '@/components/duplicate-survey-dialog';
import {LoadingOverlay} from '@/components/loading-overlay';
import {PublishDialog} from './publish-dialog';

export const DesignerDialogs = ({children}: React.PropsWithChildren) => {
  return (
    <LoadingOverlay>
      <DuplicateSurveyDialog>
        <PublishDialog>
          <DeleteSurveyDialog>{children}</DeleteSurveyDialog>
        </PublishDialog>
      </DuplicateSurveyDialog>
    </LoadingOverlay>
  );
};
