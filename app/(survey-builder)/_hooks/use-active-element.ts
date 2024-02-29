import {ElementSchema} from '@/lib/validations/survey';
import {useActiveElementRef} from '../../../features/survey-designer/store/active-element-ref';
import {useSurveyElements} from '../../../features/survey-designer/store/survey-designer-store';

type UseActiveElementResult = {
  activeElement: ElementSchema | null;
  activeElementIndex: number;
};

export const useActiveElement = (): UseActiveElementResult => {
  const elements = useSurveyElements();
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
