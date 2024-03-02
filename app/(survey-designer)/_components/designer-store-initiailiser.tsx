'use client';

import {useRef} from 'react';
import {
  createSurveyDesignerStore,
  SurveyDesignerStoreProvider,
} from '@/survey-designer/_store/survey-designer-store';
import {SurveyWithParsedModelType} from '@/types/survey';

type DesignerStoreInitialiserProps = {
  survey?: Partial<SurveyWithParsedModelType>;
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
