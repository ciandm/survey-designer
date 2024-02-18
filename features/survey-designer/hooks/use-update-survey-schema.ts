import {useIsMutating, useMutation} from '@tanstack/react-query';
import {updateSurveyInput} from '@/lib/api/survey';
import {SurveyResponse, UpdateSurveySchema} from '@/lib/validations/survey';
import {
  useSurveySchema,
  useSurveySchemaActions,
} from '../store/survey-designer';

export const USE_UPDATE_SURVEY_SCHEMA_MUTATION =
  'USE_UPDATE_SURVEY_SCHEMA_MUTATION';

export const useUpdateSurveySchema = () => {
  const {version} = useSurveySchema();
  const {setSavedSchema, setSchema} = useSurveySchemaActions();
  return useMutation<SurveyResponse, Error, UpdateSurveySchema['survey']>({
    mutationFn: async ({id, title, elements: questions}) => {
      const response = await updateSurveyInput({
        survey: {
          id,
          title,
          elements: questions,
          version,
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
