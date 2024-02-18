import {ElementSchema} from '@/lib/validations/survey';
import {useActiveElementId} from '../store/active-element-ref';
import {useSurveyElements} from '../store/survey-designer';

type UseActiveElementResult = {
  activeElement: ElementSchema | null;
  activeElementIndex: number;
};

export const useActiveElement = (): UseActiveElementResult => {
  const elements = useSurveyElements();
  const activeElementId = useActiveElementId();

  const activeElementIndex = elements.findIndex(
    (element) => element.ref === activeElementId,
  );

  const activeElement = elements[activeElementIndex] ?? null;

  return {
    activeElement,
    activeElementIndex,
  };
};
