import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {publishSurvey, unpublishSurvey} from '@/lib/api/survey';
import {SurveyResponse} from '@/lib/validations/survey';
import {
  setPublished,
  surveyIdSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer';

type PublishAction = 'publish' | 'unpublish';

export const usePublishSurvey = () => {
  const surveyId = useSurveyDesignerStore(surveyIdSelector);
  const [action, setAction] = useState<PublishAction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    mutateAsync: handlePublishSurvey,
    reset: resetMutation,
    ...rest
  } = useMutation<SurveyResponse, Error, {action: PublishAction}>({
    mutationFn: async ({action}) => {
      const fn = action === 'publish' ? publishSurvey : unpublishSurvey;
      return await fn(surveyId);
    },
  });

  const handlePublish = async (action: PublishAction) => {
    setAction(action);
    setIsDialogOpen(true);
    try {
      const {survey} = await handlePublishSurvey({action});
      setPublished(survey.is_published);
    } catch (e) {
      // UI-TODO: Show error message
      console.error(e);
    }
  };

  const handleOpenChange = () => {
    setIsDialogOpen(false);
    setAction(null);
    resetMutation();
  };

  return {
    action,
    handlePublish,
    handleOpenChange,
    isDialogOpen,
    ...rest,
  };
};
