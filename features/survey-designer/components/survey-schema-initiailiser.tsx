'use client';

import {useRef} from 'react';
import {SurveyResponse} from '@/lib/validations/survey';
import {useDesignerModeStore} from '../store/designer-mode';
import {useSurveyDesignerStore} from '../store/survey-designer';

export const SurveySchemaInitialiser = ({
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
    useDesignerModeStore.setState({
      mode: 'edit',
    });

    isInitialised.current = true;
  }

  return null;
};
