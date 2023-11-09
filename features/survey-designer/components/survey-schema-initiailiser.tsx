'use client';

import {useRef} from 'react';
import {useSurveyDesignerStore} from '@/features/survey-designer/store/survey-designer';
import {Configuration} from '@/lib/validations/question';

export const SurveySchemaInitialiser = ({
  surveyConfig,
}: {
  surveyConfig: Configuration;
}) => {
  const isInitialised = useRef(false);

  if (!isInitialised.current) {
    useSurveyDesignerStore.setState({
      id: surveyConfig.id,
      questions: surveyConfig.fields,
      title: surveyConfig.name,
      mode: 'edit',
    });

    isInitialised.current = true;
  }

  return null;
};
