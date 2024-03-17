'use client';

import {useRef} from 'react';
import {
  createDesignerStore,
  SurveyDesignerStoreProvider,
} from '@/features/survey-designer/store/designer-store';
import {SurveyWithParsedModelType} from '@/types/survey';

type DesignerStoreInitialiserProps = {
  survey?: Partial<SurveyWithParsedModelType>;
  children: React.ReactNode;
};

export const DesignerStoreInitialiser = ({
  survey,
  children,
}: DesignerStoreInitialiserProps) => {
  const designerStore = useRef(createDesignerStore({...survey})).current;

  return (
    <SurveyDesignerStoreProvider value={designerStore}>
      {children}
    </SurveyDesignerStoreProvider>
  );
};
