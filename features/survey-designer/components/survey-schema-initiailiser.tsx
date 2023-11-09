'use client';

import {useRef} from 'react';
import {Configuration} from '@/lib/validations/question';
import {useDesignerModeStore} from '../store/designer-mode';
import {useQuestionsStore} from '../store/questions';
import {useSurveyDetailsStore} from '../store/survey-details';

export const SurveySchemaInitialiser = ({
  surveyConfig,
}: {
  surveyConfig: Configuration;
}) => {
  const isInitialised = useRef(false);

  if (!isInitialised.current) {
    useSurveyDetailsStore.setState({
      id: surveyConfig.id,
      title: surveyConfig.name,
    });
    useQuestionsStore.setState({
      questions: surveyConfig.fields,
    });
    useDesignerModeStore.setState({
      mode: 'edit',
    });

    isInitialised.current = true;
  }

  return null;
};
