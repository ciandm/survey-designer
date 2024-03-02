import {useReducer, useState} from 'react';
import {useAction} from 'next-safe-action/hooks';
import {
  useDesignerActions,
  useSurveyId,
} from '@/survey-designer/_store/survey-designer-store';
import {publishSurveyAction} from '../_actions/publish-survey';

type PublishAction = 'publish' | 'unpublish';

export const usePublishDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<PublishAction | null>(null);
  const surveyId = useSurveyId();
  const {setPublished} = useDesignerActions();
  const {execute: handlePublishSurvey, ...rest} = useAction(
    publishSurveyAction,
    {
      onSuccess: ({survey}) => {
        setPublished(survey.is_published);
      },
    },
  );

  const handleTriggerPublishDialog = async (action: PublishAction) => {
    setAction(action);
    setIsOpen(true);
    handlePublishSurvey({action, surveyId});
  };

  const handleRetry = async () => {
    if (action) {
      handlePublishSurvey({action, surveyId});
    }
  };

  const handleOnOpenChange = () => {
    setIsOpen((prev) => !prev);
    setAction(null);
  };

  return {
    action,
    isOpen,
    handleTriggerPublishDialog,
    handleOnOpenChange,
    handleRetry,
    ...rest,
  };
};
