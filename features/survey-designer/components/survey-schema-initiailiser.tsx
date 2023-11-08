'use client';

import {useEffect, useRef} from 'react';
import {Survey} from '@prisma/client';
import {configurationSchema} from '@/lib/validations/question';
import {useSurveyStore} from '@/stores/survey-schema';
import {useActiveQuestion} from '../hooks/use-active-question';

export const SurveySchemaInitialiser = ({survey}: {survey: Survey}) => {
  const {activeQuestion, setActiveQuestion} = useActiveQuestion();
  const parsedSchema = configurationSchema.safeParse(survey.schema);
  const isInitialised = useRef(false);

  if (!parsedSchema.success) {
    // TODO: Handle invalid schema
    throw new Error('Invalid schema');
  }

  useEffect(() => {
    const initialQuestion = parsedSchema.data.fields.find(
      (field) => field.id === activeQuestion?.id,
    );

    if (initialQuestion) {
      setActiveQuestion(initialQuestion.ref);
    } else {
      const firstQuestion = parsedSchema.data.fields[0];
      setActiveQuestion(firstQuestion.ref, {shallow: false});
    }
  }, []);

  if (!isInitialised.current) {
    useSurveyStore.setState({
      questions: parsedSchema.data.fields,
      title: survey.name,
    });

    isInitialised.current = true;
  }

  return null;
};
