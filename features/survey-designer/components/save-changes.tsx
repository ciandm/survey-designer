'use client';

import {useParams} from 'next/navigation';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {useUpdateSurveySchema} from '../hooks/use-update-survey-schema';
import {
  useIsSurveyChanged,
  useSurveySchema,
} from '../store/survey-designer-store';

export const SaveChanges = () => {
  const {id} = useParams();
  const schema = useSurveySchema();
  const {mutate: handleUpdateSurveySchema, isPending: isPendingUpdateSchema} =
    useUpdateSurveySchema();
  const isChanged = useIsSurveyChanged();

  const onSaveChanges = async () => {
    handleUpdateSurveySchema(
      {...schema},
      {
        onSuccess: () => {
          toast('Survey saved', {
            description: 'Your survey has been saved successfully.',
            action: {
              label: 'View',
              onClick: () => {
                window.open(`/survey/${id}`);
              },
            },
          });
        },
      },
    );
  };
  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={onSaveChanges}
      disabled={isPendingUpdateSchema || !isChanged}
    >
      Save
    </Button>
  );
};
