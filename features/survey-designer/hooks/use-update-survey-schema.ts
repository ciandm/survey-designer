import {useIsMutating, useMutation} from '@tanstack/react-query';
import {updateSurveyInput} from '@/lib/api/survey';
import {SurveyResponse, UpdateSurveySchema} from '@/lib/validations/survey';
import {
  setSavedSchema,
  setSchema,
  surveySchemaSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer';

export const USE_UPDATE_SURVEY_SCHEMA_MUTATION =
  'USE_UPDATE_SURVEY_SCHEMA_MUTATION';

export const useUpdateSurveySchema = () => {
  const {version} = useSurveyDesignerStore(surveySchemaSelector);
  return useMutation<SurveyResponse, Error, UpdateSurveySchema['survey']>({
    mutationFn: async (args) => {
      const response = await updateSurveyInput({
        survey: {
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
