'use client';

import {Button} from '@/components/ui/button';
import {useDeleteSurveyResult} from '../_hooks/use-delete-response';

type Props = {
  surveyId: string;
  responseId: string;
};

export const DeleteResponseButton = ({surveyId, responseId}: Props) => {
  const {mutate: handleDeleteResult} = useDeleteSurveyResult();

  return (
    <Button onClick={() => handleDeleteResult({surveyId, responseId})}>
      Delete response
    </Button>
  );
};
