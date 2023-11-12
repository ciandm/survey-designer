'use client';

import {RefreshCw} from 'lucide-react';
import Link from 'next/link';
import {Button, buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {useUpdateSurveySchema} from '../hooks/use-update-survey-schema';
import {useDesignerModeActions} from '../store/designer-mode';
import {
  useIsSurveyChanged,
  useSurveyDetails,
  useSurveyDetailsActions,
  useSurveyQuestions,
  useSurveySchema,
} from '../store/survey-designer';
import {ContentEditable} from './content-editable';
import {SurveyActions} from './survey-actions';

export const EditorHeader = () => {
  const survey = useSurveyDetails();
  const questions = useSurveyQuestions();
  const isChanged = useIsSurveyChanged();
  const schema = useSurveySchema();
  const {mutateAsync: handleUpdateSurveySchema} = useUpdateSurveySchema();

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
        <Button size="sm" variant="secondary" onClick={handleOnPreviewClick}>
          Preview
        </Button>
        <Button size="sm" onClick={() => alert('TODO: Publish')}>
          Publish
        </Button>
        <SurveyActions />
      </div>
    </header>
  );
};

const UnsavedChangesButton = () => {
  const isDirty = useIsSurveyChanged();
  const schema = useSurveySchema();
  const {mutate: handleUpdateSurveySchema, isPending: isPendingUpdateSchema} =
    useUpdateSurveySchema();

  if (!isDirty) return null;

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => handleUpdateSurveySchema({...schema})}
      disabled={isPendingUpdateSchema}
      className="mr-4"
    >
      <RefreshCw
        className={cn('mr-2 h-4 w-4 flex-shrink-0', {
          'animate-spin': isPendingUpdateSchema,
        })}
      />
      Save changes
    </Button>
  );
};
