import {ElementSchema} from '@/lib/validations/survey';
import {useActiveElementRef} from '../store/active-element-ref';
import {
  surveyElementsSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer-store';

type UseActiveElementResult = {
  activeElement: ElementSchema | null;
  activeElementIndex: number;
};

export const useActiveElement = (): UseActiveElementResult => {
  const elements = useSurveyDesignerStore(surveyElementsSelector);
  const activeElementRef = useActiveElementRef();

  const activeElementIndex = elements.findIndex(
    (element) => element.ref === activeElementRef,
  );

  const activeElement = elements[activeElementIndex] ?? null;

  return {
    activeElement,
    activeElementIndex,
  };
};
