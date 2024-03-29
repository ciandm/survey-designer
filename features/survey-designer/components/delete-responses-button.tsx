'use client';

import React from 'react';
import {Button} from '@/components/ui';
import {useDeleteResponses} from '@/features/survey-designer/hooks/use-delete-responses';

export const DeleteResponsesButton = ({surveyId}: {surveyId: string}) => {
  const {mutate: handleDeleteResponses} = useDeleteResponses();

  return (
    <Button onClick={() => handleDeleteResponses({surveyId})}>
      Delete all
    </Button>
  );
};
