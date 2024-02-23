'use client';

import {sortQuestionChoices} from '@/features/survey-tool/utils/question';
import {SurveyForm} from '../../survey-tool/components/survey-form';
import {
  surveySchemaSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer';

export const SurveyPreviewer = () => {
  const survey = useSurveyDesignerStore(surveySchemaSelector);
  const schemaWithRandomisedChoices = sortQuestionChoices(survey);

  return (
    <SurveyForm
      shouldSubmitResults={false}
      schema={schemaWithRandomisedChoices}
    />
  );
};
