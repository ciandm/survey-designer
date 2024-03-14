import {useCallback} from 'react';
import {useQueryState} from 'nuqs';
import {useDesignerStoreElements} from '@/survey-designer/_store/designer-store/designer-store';
import {getElementByIdWithFallback} from './use-designer.utils';

export const useElementController = () => {
  const elements = useDesignerStoreElements();
  const [selectedId, setSelectedId] = useQueryState('id');

  const element = getElementByIdWithFallback({
    id: selectedId ?? '',
    elements,
  });

  const handleSetSelectedElement = useCallback(
    ({id}: {id: string}) => {
      setSelectedId(id);
    },
    [setSelectedId],
  );

  return {
    element,
    handleSetSelectedElement,
  };
};

export type UseElementControllerReturn = ReturnType<
  typeof useElementController
>;
