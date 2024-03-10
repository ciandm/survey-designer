import {useMemo} from 'react';
import {useSurveyElements} from '@/survey-designer/_store/survey-designer-store';
import {ElementSchemaType} from '@/types/element';
import {useActiveElementId} from '../_store/active-element-id-store';

type UseActiveElementResult = {
  activeElement: ElementSchemaType;
  activeElementIndex: number;
};

export const useActiveElement = (): UseActiveElementResult => {
  const elements = useSurveyElements();
  const activeElementId = useActiveElementId();

  const index = useMemo(
    () => elements.findIndex((element) => element.id === activeElementId),
    [elements, activeElementId],
  );

  const element = index > -1 ? elements[index] : elements[0];

  return {
    activeElement: element,
    activeElementIndex: index,
  };
};
