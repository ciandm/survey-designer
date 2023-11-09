'use client';

import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {EyeIcon, Loader2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useToast} from '@/components/ui/use-toast';
import {
  useSurveyDesignerActions,
  useSurveyDesignerStore,
  useSurveyTitle,
} from '@/features/survey-designer/store/survey-designer';
import {ContentEditable} from './content-editable';

export const EditorHeader = () => {
  const survey = useSurveyDesignerStore();
  const {toast} = useToast();
  const {mutateAsync, isPending} = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/v1/surveys/${survey.id}/schema`, {
        id: survey.id,
        name: survey.title,
        fields: survey.questions,
      }),
  });
  const title = useSurveyTitle();
  const {updateTitle, updateMode} = useSurveyDesignerActions();

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
          html={title}
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
