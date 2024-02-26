import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {api} from '@/lib/api/survey';
import {SurveyResponse} from '@/lib/validations/survey';
import {useDesignerActions, useSurveyId} from '../store/survey-designer-store';

type PublishAction = 'publish' | 'unpublish';

export const usePublishDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<PublishAction | null>(null);
  const surveyId = useSurveyId();
  const {setPublished} = useDesignerActions();

  const {
    mutateAsync: handlePublishSurvey,
    reset: resetMutation,
    ...rest
  } = useMutation<SurveyResponse, Error, {action: PublishAction}>({
    mutationFn: async ({action}) => {
      const fn = action === 'publish' ? api.publishSurvey : api.unpublishSurvey;
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
