'use client';

import {useRef} from 'react';
import {SurveySchema} from '@/lib/validations/survey';
import {useDesignerModeStore} from '../store/designer-mode';
import {useSurveySchemaStore} from '../store/survey-designer';

export const SurveySchemaInitialiser = ({schema}: {schema: SurveySchema}) => {
  const isInitialised = useRef(false);

  if (!isInitialised.current) {
    useSurveySchemaStore.setState({
      schema,
      savedSchema: schema,
    });
    useDesignerModeStore.setState({
      mode: 'edit',
    });

    isInitialised.current = true;
  }

  return null;
};
