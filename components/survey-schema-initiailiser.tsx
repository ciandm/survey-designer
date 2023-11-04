'use client';

import {useRef} from 'react';
import {Survey} from '@prisma/client';
import {StoreApi} from 'zustand';
import {configurationSchema} from '@/lib/validations/question';
import {
  createSurveySchemaStore,
  SurveySchemaState,
  SurveySchemaStoreContext,
  useSurveySchemaStore,
} from '@/stores/survey-schema';

export const SurveySchemaInitialiser = ({
  children,
  survey,
}: React.PropsWithChildren<{survey: Survey}>) => {
  const parsedSchema = configurationSchema.safeParse(survey.schema);

  if (!parsedSchema.success) {
    throw new Error('Invalid schema');
  }

  const storeRef = useRef<StoreApi<SurveySchemaState>>();

  if (!storeRef.current) {
    storeRef.current = createSurveySchemaStore({
      title: survey.name,
      questions: parsedSchema.data.fields,
      activeQuestionRef: parsedSchema.data.fields[0].ref,
    });
  }

  return (
    <SurveySchemaStoreContext.Provider value={storeRef.current}>
      {children}
    </SurveySchemaStoreContext.Provider>
  );
};

export const useSurveyQuestions = () =>
  useSurveySchemaStore((state) => state.questions);
export const useSurveyFieldActions = () =>
  useSurveySchemaStore((state) => state.actions);
export const useActiveQuestionRef = () =>
  useSurveySchemaStore((state) => state.activeQuestionRef);
export const useActiveQuestion = () => {
  const activeQuestionRef = useActiveQuestionRef();
  const questions = useSurveyQuestions();
  const question = questions.find((q) => q.ref === activeQuestionRef);
  const index = questions.findIndex((q) => q.ref === activeQuestionRef);

  return {activeQuestion: question, activeQuestionIndex: index};
};
