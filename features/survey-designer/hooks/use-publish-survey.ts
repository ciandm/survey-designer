import {useState} from 'react';
import {publishSurvey} from '../actions/survey';
import {
  setPublished,
  surveyPublishedSelector,
  surveySchemaSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer';

type Status =
  | 'idle'
  | 'publishing'
  | 'unpublishing'
  | 'published'
  | 'unpublished'
  | 'error';

export const usePublishSurvey = () => {
  const isPublished = useSurveyDesignerStore(surveyPublishedSelector);
  const schema = useSurveyDesignerStore(surveySchemaSelector);
  const [status, setStatus] = useState<Status>('idle');

  const handlePublish = async (action: 'publish' | 'unpublish') => {
    setStatus(action === 'publish' ? 'publishing' : 'unpublishing');
    try {
      const {is_published} = await publishSurvey(schema.id, action);
      setPublished(is_published);
      setStatus(is_published ? 'published' : 'unpublished');
    } catch (e) {
      // UI-TODO: Show error message
      console.error(e);
    }
  };

  const handleOpenChange = () => {
    setStatus('idle');
  };

  return {
    isPublished,
    publish: {
      handlePublish,
      status,
      pending: status === 'publishing' || status === 'unpublishing',
      success: status === 'published' || status === 'unpublished',
    },
    dialog: {
      isOpen: status !== 'idle',
      handleOpenChange,
    },
  };
};
