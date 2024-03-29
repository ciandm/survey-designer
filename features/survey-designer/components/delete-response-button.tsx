'use client';

import {Button} from '@/components/ui';
import {useDeleteSurveyResult} from '@/features/survey-designer/hooks/use-delete-response';

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
