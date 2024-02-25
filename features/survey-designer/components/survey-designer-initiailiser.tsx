'use client';

import {useEffect, useRef} from 'react';
import {SurveyResponse} from '@/lib/validations/survey';
import {useSurveyDesignerStore} from '../store/survey-designer';

export const SurveyDesignerInitialiser = ({
  survey,
}: {
  survey: SurveyResponse['survey'];
}) => {
  const isInitialised = useRef(false);

  useEffect(() => {
    if (!isInitialised.current) {
      useSurveyDesignerStore.setState({
        schema: survey.schema,
        savedSchema: survey.schema,
        isPublished: survey.is_published,
        id: survey.id,
      });

      isInitialised.current = true;
    }
  }, [survey]);

  return null;
};
