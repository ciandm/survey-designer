'use client';

import {useRef} from 'react';
import {SurveyResponse} from '@/lib/validations/survey';
import {useSurveyDesignerStore} from '../store/survey-designer';

export const SurveyDesignerInitialiser = ({
  survey,
}: {
  survey: SurveyResponse['survey'];
}) => {
  const isInitialised = useRef(false);

  if (!isInitialised.current) {
    useSurveyDesignerStore.setState({
      schema: survey.schema,
      savedSchema: survey.schema,
      isPublished: survey.is_published,
    });

    isInitialised.current = true;
  }

  return null;
};
