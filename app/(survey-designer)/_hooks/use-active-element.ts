import {ElementSchema} from '@/lib/validations/survey';
import {useActiveElementRef} from '@/survey-designer/_store/active-element-ref';
import {useSurveyElements} from '@/survey-designer/_store/survey-designer-store';

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
