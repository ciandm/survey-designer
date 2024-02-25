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

export const usePublishDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<PublishAction | null>(null);
  const surveyId = useSurveyDesignerStore(surveyIdSelector);

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

  const onPublish = async (action: PublishAction) => {
    setAction(action);
    setIsOpen(true);
    try {
      const {survey} = await handlePublishSurvey({action});
      setPublished(survey.is_published);
    } catch (e) {
      // UI-TODO: Show error message
      console.error(e);
    }
  };

  const onRetry = async () => {
    if (action) {
      try {
        await handlePublishSurvey({action});
      } catch (e) {
        // UI-TODO: Show error message
        console.error(e);
      }
    }
  };

  const onOpenChange = () => {
    setIsOpen((prev) => !prev);
    setAction(null);
    resetMutation();
  };

  return {
    action,
    isOpen,
    onPublish,
    onOpenChange,
    onRetry,
    ...rest,
  };
};
