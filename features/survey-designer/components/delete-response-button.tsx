'use client';

import {Button} from '@/components/ui/button';
import {useDeleteResponse} from '../hooks/use-delete-response';

type Props = {
  surveyId: string;
  responseId: string;
};

export const DeleteResponseButton = ({surveyId, responseId}: Props) => {
  const {mutate: handleDeleteResponses} = useDeleteResponse();

  return (
    <Button onClick={() => handleDeleteResponses({surveyId, responseId})}>
      Delete response
    </Button>
  );
};
