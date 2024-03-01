'use client';

import {useRef} from 'react';
import {SurveyResponse} from '@/lib/validations/survey';
import {
  createSurveyDesignerStore,
  SurveyDesignerStoreProvider,
} from '@/survey-designer/_store/survey-designer-store';

type DesignerStoreInitialiserProps = {
  survey?: SurveyResponse['survey'];
  children: React.ReactNode;
};

export const DesignerStoreInitialiser = ({
  survey,
  children,
}: DesignerStoreInitialiserProps) => {
  const store = useRef(createSurveyDesignerStore({...survey})).current;

  return (
    <SurveyDesignerStoreProvider value={store}>
      {children}
    </SurveyDesignerStoreProvider>
  );
};
