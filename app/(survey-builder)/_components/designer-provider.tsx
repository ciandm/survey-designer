'use client';

import {useRef} from 'react';
import {SurveyResponse} from '@/lib/validations/survey';
import {
  createSurveyDesignerStore,
  SurveyDesignerStoreProvider,
} from '../../../features/survey-designer/store/survey-designer-store';

type DesignerProviderProps = {
  survey: SurveyResponse['survey'];
  children: React.ReactNode;
};

export const DesignerProvider = ({survey, children}: DesignerProviderProps) => {
  const store = useRef(createSurveyDesignerStore({...survey})).current;

  return (
    <SurveyDesignerStoreProvider value={store}>
      {children}
    </SurveyDesignerStoreProvider>
  );
};
