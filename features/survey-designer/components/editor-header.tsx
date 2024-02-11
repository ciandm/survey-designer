'use client';

import {useState} from 'react';
import {Loader2, RefreshCw} from 'lucide-react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {cn} from '@/lib/utils';
import {useManageSurveyPublication} from '../hooks/use-manage-survey-publication';
import {useUpdateSurveySchema} from '../hooks/use-update-survey-schema';
import {
  useIsSurveyChanged,
  useIsSurveyPublished,
  useSurveyDetails,
  useSurveyQuestions,
  useSurveySchema,
} from '../store/survey-designer';
import {SurveyActions} from './survey-actions';

export const EditorHeader = () => {
  const params = useParams();

  return (
    <header className="flex h-16 w-full items-center justify-between gap-2 bg-background px-4">
      <div className="flex items-center gap-4">
        <Link href={`/editor/${params.id}/designer`}>Designer</Link>
        <Link href={`/editor/${params.id}/responses`}>Responses</Link>
      </div>
      <div className="flex gap-2">
        <UnsavedChangesButton />
        {/* UI-TODO: Add Preview */}
        <PublishButton />
        <SurveyActions />
      </div>
    </header>
  );
};

const UnsavedChangesButton = () => {
  const schema = useSurveySchema();
  const {mutate: handleUpdateSurveySchema, isPending: isPendingUpdateSchema} =
    useUpdateSurveySchema();
  const isChanged = useIsSurveyChanged();

  if (!isChanged) return null;

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => handleUpdateSurveySchema({...schema})}
      disabled={isPendingUpdateSchema}
    >
      Save
      <RefreshCw
        className={cn('ml-2 h-4 w-4 flex-shrink-0', {
          'animate-spin': isPendingUpdateSchema,
        })}
      />
    </Button>
  );
};

const PublishButton = () => {
  const survey = useSurveyDetails();
  const isPublished = useIsSurveyPublished();
  const {mutateAsync: handleManageSurveyPublication} =
    useManageSurveyPublication();
  const schema = useSurveySchema();
  const {mutateAsync: handleUpdateSurveySchema} = useUpdateSurveySchema();
  const isChanged = useIsSurveyChanged();
  const questions = useSurveyQuestions();
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  const handleOnPublishClick = async () => {
    setIsPublishDialogOpen(true);
    try {
      if (isChanged) {
        await handleUpdateSurveySchema({
          ...schema,
          questions,
        });
      }
      await handleManageSurveyPublication({
        surveyId: survey.id,
        action: isPublished ? 'unpublish' : 'publish',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishDialogOpen(false);
    }
  };

  return (
    <>
      <Button onClick={handleOnPublishClick} size="sm">
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <Dialog open={isPublishDialogOpen}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>
              {isPublished ? 'Unpublishing' : 'Publishing'} survey
            </DialogTitle>
            <DialogDescription>This may take a few seconds.</DialogDescription>
          </DialogHeader>
          <Loader2 className="h-8 w-8 animate-spin" />
        </DialogContent>
      </Dialog>
    </>
  );
};
