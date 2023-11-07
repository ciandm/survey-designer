'use client';

import {useRef} from 'react';
import {Survey} from '@prisma/client';
import {configurationSchema} from '@/lib/validations/question';
import {useSurveyStore} from '@/stores/survey-schema';

export const SurveySchemaInitialiser = ({survey}: {survey: Survey}) => {
  const parsedSchema = configurationSchema.safeParse(survey.schema);
  const isInitialised = useRef(false);

  if (!parsedSchema.success) {
    // TODO: Handle invalid schema
    throw new Error('Invalid schema');
  }

  if (!isInitialised.current) {
    useSurveyStore.setState({
      questions: parsedSchema.data.fields,
      activeQuestionRef: parsedSchema.data.fields[0].ref ?? '',
      title: survey.name,
    });

    isInitialised.current = true;
  }

  return null;
};
