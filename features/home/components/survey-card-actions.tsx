'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useDeleteSurveyConfirm} from '@/components/delete-survey';
import {Button} from '@/components/ui/button';

export const SurveyCardActions = ({surveyId}: {surveyId: string}) => {
  const onConfirmDelete = useDeleteSurveyConfirm();
  const router = useRouter();

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => onConfirmDelete({surveyId}).then(() => router.refresh())}
      >
        Delete
      </Button>
      <Button variant="default" asChild>
        <Link href={`/editor/${surveyId}/designer`}>View</Link>
      </Button>
    </>
  );
};
