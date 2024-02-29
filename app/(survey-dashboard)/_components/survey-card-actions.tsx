'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useDeleteSurveyDialogTrigger} from '@/components/delete-survey-dialog';
import {Button} from '@/components/ui/button';
import {getSiteUrl} from '@/lib/hrefs';

export const SurveyCardActions = ({surveyId}: {surveyId: string}) => {
  const {handleTriggerDeleteSurveyConfirm} = useDeleteSurveyDialogTrigger();
  const router = useRouter();

  const handleDeleteSurvey = () => {
    handleTriggerDeleteSurveyConfirm({surveyId}).then(() => router.refresh());
  };

  return (
    <>
      <Button variant="secondary" onClick={handleDeleteSurvey}>
        Delete
      </Button>
      <Button variant="default" asChild>
        <Link href={getSiteUrl.designerPage({surveyId})}>View</Link>
      </Button>
    </>
  );
};
