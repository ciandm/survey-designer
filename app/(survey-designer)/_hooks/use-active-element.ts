import {useActiveElementRef} from '@/survey-designer/_store/active-element-ref';
import {useSurveyElements} from '@/survey-designer/_store/survey-designer-store';
import {ElementSchemaType} from '@/types/element';

type UseActiveElementResult = {
  activeElement: ElementSchemaType | null;
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
