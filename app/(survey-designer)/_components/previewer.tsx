'use client';

import {Survey} from '@/components/survey';
import {useSurveyModel} from '../_hooks/use-survey-model';
import {useDesignerStoreSurveyId} from '../_store/designer-store/designer-store';

export const Previewer = () => {
  const model = useSurveyModel();
  const id = useDesignerStoreSurveyId();

  return <Survey model={model} id={id} isPreview />;
};
