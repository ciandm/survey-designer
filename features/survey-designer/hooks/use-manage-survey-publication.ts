import {useMutation} from '@tanstack/react-query';
import {publishSurvey, unpublishSurvey} from '@/lib/api/survey';
import {SurveyResponse} from '@/lib/validations/survey';
import {useDesignerActions} from '../store/survey-designer-store';

type PublishSurveyParams = {
  surveyId: string;
  action: 'publish' | 'unpublish';
};

export const useManageSurveyPublication = () => {
  const {setPublished} = useDesignerActions();
  return useMutation<SurveyResponse, Error, PublishSurveyParams>({
    mutationFn: async ({surveyId, action = 'publish'}) => {
      const fn = action === 'publish' ? publishSurvey : unpublishSurvey;

      const response = await fn(surveyId);
      const {survey} = response;

      setPublished(survey.is_published);

      return response;
    },
  });
};
