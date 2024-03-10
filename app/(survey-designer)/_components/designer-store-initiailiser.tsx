'use client';

import {useRef} from 'react';
import {
  createSurveyDesignerStore,
  SurveyDesignerStoreProvider,
} from '@/survey-designer/_store/survey-designer-store';
import {SurveyWithParsedModelType} from '@/types/survey';
import {
  ActiveElementStoreProvider,
  createActiveElementStore,
} from '../_store/active-element-id-store';

type DesignerStoreInitialiserProps = {
  survey?: Partial<SurveyWithParsedModelType>;
  children: React.ReactNode;
};

export const DesignerStoreInitialiser = ({
  survey,
  children,
}: DesignerStoreInitialiserProps) => {
  const designerStore = useRef(createSurveyDesignerStore({...survey})).current;

  const initialActiveElementId = survey?.model?.elements[0].id;
  const activeElementStore = useRef(
    createActiveElementStore({activeElementId: initialActiveElementId}),
  ).current;

  return (
    <ActiveElementStoreProvider value={activeElementStore}>
      <SurveyDesignerStoreProvider value={designerStore}>
        {children}
      </SurveyDesignerStoreProvider>
    </ActiveElementStoreProvider>
  );
};
