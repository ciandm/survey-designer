import {useCallback} from 'react';
import {useQueryState} from 'nuqs';
import {useDesignerStoreElements} from '@/features/survey-designer/store/designer-store';
import {getElementByIdWithFallback} from './use-designer-element.utils';

export const useDesignerElement = () => {
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

export type UseDesignerElementReturn = ReturnType<typeof useDesignerElement>;
