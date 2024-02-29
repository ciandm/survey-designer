import {useIsMutating, useMutation} from '@tanstack/react-query';
import {surveyApi} from '@/lib/api/survey';
import {SurveyResponse, UpdateSurveySchema} from '@/lib/validations/survey';
import {
  useDesignerActions,
  useSurveyId,
  useSurveySchema,
} from '@/survey-dashboard/_store/survey-designer-store';

export const USE_UPDATE_SURVEY_SCHEMA_MUTATION =
  'USE_UPDATE_SURVEY_SCHEMA_MUTATION';

export const useUpdateSurveySchema = () => {
  const {version} = useSurveySchema();
  const surveyId = useSurveyId();
  const {setSchema, setSavedSchema} = useDesignerActions();
  return useMutation<SurveyResponse, Error, UpdateSurveySchema['schema']>({
    mutationFn: async (args) => {
      const response = await surveyApi.updateSurveyInput(surveyId, {
        schema: {
          ...args,
          version: version + 1,
        },
      });
      setSchema(response.survey.schema);
      setSavedSchema(response.survey.schema);
      return response;
    },
    mutationKey: [USE_UPDATE_SURVEY_SCHEMA_MUTATION],
  });
};

export const useIsUpdateSurveySchemaLoading = () =>
  useIsMutating({
    mutationKey: [USE_UPDATE_SURVEY_SCHEMA_MUTATION],
  });
