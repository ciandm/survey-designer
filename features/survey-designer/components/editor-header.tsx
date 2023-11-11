'use client';

import {useMutation} from '@tanstack/react-query';
import {EyeIcon, Loader2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useToast} from '@/components/ui/use-toast';
import {updateSurveySchema} from '@/lib/api/survey';
import {useDesignerModeActions} from '../store/designer-mode';
import {
  useSurveyDetails,
  useSurveyDetailsActions,
  useSurveyQuestions,
} from '../store/survey-designer';
import {ContentEditable} from './content-editable';

export const EditorHeader = () => {
  const survey = useSurveyDetails();
  const questions = useSurveyQuestions();
  const {toast} = useToast();
  const {mutateAsync, isPending} = useMutation({
    mutationFn: async () =>
      updateSurveySchema({
        survey: {
          id: survey.id,
          title: survey.title,
          questions,
        },
      }),
  });
  const {updateTitle} = useSurveyDetailsActions();
  const {updateMode} = useDesignerModeActions();

  const handleOnPreviewClick = async () => {
    try {
      await mutateAsync();
      toast({
        title: 'Survey saved',
        description: 'Your survey has been saved successfully',
      });
      updateMode('preview');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="flex items-center justify-between gap-2 border-b bg-background p-4">
      <div className="flex flex-col gap-1">
        <ContentEditable
          html={survey.title}
          className="text-md font-semibold"
          placeholder="Untitled Survey"
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleOnPreviewClick}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <EyeIcon className="mr-2 h-4 w-4" />
          )}
          Preview
        </Button>
        <Button onClick={() => alert('TODO: Publish')}>Publish</Button>
      </div>
    </header>
  );
};
