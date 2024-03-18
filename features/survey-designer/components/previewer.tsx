'use client';

import {useMemo} from 'react';
import {Survey} from '@/components/survey';
import {
  useDesignerStoreElements,
  useDesignerStoreSurvey,
  useDesignerStoreSurveyId,
} from '../store/designer-store';
import {buildSurveyModel} from '../utils/model';

export const Previewer = () => {
  const elements = useDesignerStoreElements();
  const survey = useDesignerStoreSurvey();
  const id = useDesignerStoreSurveyId();

  const model = useMemo(
    () => buildSurveyModel({survey, elements}, {shouldSortChoices: true}),
    [elements, survey],
  );

  return <Survey model={model} id={id} isPreview />;
};
