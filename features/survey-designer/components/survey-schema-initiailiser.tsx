'use client';

import {useRef} from 'react';
import {SurveySchema} from '@/lib/validations/survey';
import {useDesignerModeStore} from '../store/designer-mode';
import {useQuestionsStore} from '../store/questions';
import {useSurveyDetailsStore} from '../store/survey-details';

export const SurveySchemaInitialiser = ({schema}: {schema: SurveySchema}) => {
  const isInitialised = useRef(false);

  if (!isInitialised.current) {
    useSurveyDetailsStore.setState({
      id: schema.id,
      title: schema.title,
    });
    useQuestionsStore.setState({
      questions: schema.questions,
    });
    useDesignerModeStore.setState({
      mode: 'edit',
    });

    isInitialised.current = true;
  }

  return null;
};
