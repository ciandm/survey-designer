'use client';

import {RefreshCw} from 'lucide-react';
import {Button} from '@/components/ui/button';
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
      <div className="flex flex-col gap-1">
        <ContentEditable
          html={survey.title}
          className="text-md font-semibold"
          placeholder="Untitled Survey"
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <UnsavedChangesButton />
        <Button variant="secondary" onClick={handleOnPreviewClick}>
          Preview
        </Button>
        <Button variant="secondary" onClick={() => alert('TODO: Publish')}>
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
