'use client';

import {useState} from 'react';
import {CheckIcon} from '@radix-ui/react-icons';
import {EyeIcon, Loader2, RefreshCw} from 'lucide-react';
import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {Button, buttonVariants} from '@/components/ui/button';
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
import {useDesignerModeActions} from '../store/designer-mode';
import {
  useIsSurveyChanged,
  useIsSurveyPublished,
  useSurveyDetails,
  useSurveyDetailsActions,
  useSurveyQuestions,
  useSurveySchema,
} from '../store/survey-designer';
import {ContentEditable} from './content-editable';
import {SurveyActions} from './survey-actions';

export const EditorHeader = () => {
  const survey = useSurveyDetails();
  const isPublished = useIsSurveyPublished();
  const questions = useSurveyQuestions();
  const isChanged = useIsSurveyChanged();
  const schema = useSurveySchema();
  const {mutateAsync: handleUpdateSurveySchema} = useUpdateSurveySchema();
  const {mutateAsync: handleManageSurveyPublication} =
    useManageSurveyPublication();

  const {updateTitle} = useSurveyDetailsActions();
  const {updateMode} = useDesignerModeActions();

  const handleOnPreviewClick = async () => {
    try {
      if (isChanged) {
        handleUpdateSurveySchema({
          ...schema,
          questions,
        });
      }
      updateMode('preview');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="flex items-center justify-between gap-2 border-b bg-background px-4 py-3">
      <div className="flex items-center">
        <Link href="/">
          <span
            className={cn(
              buttonVariants({variant: 'link'}),
              'p-0 text-foreground',
            )}
          >
            Home
          </span>
        </Link>
        <span className="mx-2">/</span>
        <ContentEditable
          html={survey.title}
          className="text-sm font-semibold"
          placeholder="Untitled Survey"
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <UnsavedChangesButton />
        <Button size="icon" variant="ghost" onClick={handleOnPreviewClick}>
          <EyeIcon className="h-4 w-4" />
        </Button>
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
      variant="outline"
      onClick={() => handleUpdateSurveySchema({...schema})}
      disabled={isPendingUpdateSchema}
    >
      Save changes
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
      <Button onClick={handleOnPublishClick}>
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
