import {useCallback, useMemo, useState} from 'react';
import {useQueryState} from 'nuqs';
import {
  useSurveyModel,
  useSurveyStoreActions,
} from '@/survey-designer/_store/survey-designer-store';
import {ElementType} from '@/types/element';
import {
  getElementByIdWithFallback,
  getInitialSelectedId,
  getNextElementToSelect,
} from './use-designer.utils';

export const useDesigner = () => {
  const model = useSurveyModel();
  const {elements} = model;
  const storeActions = useSurveyStoreActions();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedId, setSelectedId] = useQueryState('id', {
    defaultValue: getInitialSelectedId(model) ?? '',
  });

  const element = getElementByIdWithFallback({
    id: selectedId ?? '',
    model,
  });

  const handleSelectElement = useCallback(
    (id: string) => {
      setSelectedId(id);
    },
    [setSelectedId],
  );

  const handleSettingsClick = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const handleRemoveElement = useCallback(
    (removeId: string) => {
      const elementsBeforeDelete = [...elements];
      if (elementsBeforeDelete.length === 1) return;

      storeActions.deleteElement({id: removeId});
      if (selectedId === removeId) {
        const {id} = getNextElementToSelect(model, removeId);

        setSelectedId(id);
      }
    },
    [storeActions, model, selectedId, elements, setSelectedId],
  );

  const handleDuplicateElement = useCallback(
    (duplicateId: string) => {
      const {id} = storeActions.duplicateElement({id: duplicateId}) ?? {};

      if (id) {
        setSelectedId(id);
      }
    },
    [storeActions, setSelectedId],
  );

  const handleCreateElement = useCallback(
    ({
      type = 'short_text',
      index,
    }: {
      type?: ElementType;
      index?: number;
    } = {}) => {
      const {id} = storeActions.insertElement(
        {
          type,
        },
        index,
      );
      setSelectedId(id);
    },
    [storeActions, setSelectedId],
  );

  const handlers = useMemo(
    () => ({
      handleSelectElement,
      handleRemoveElement,
      handleDuplicateElement,
      handleCreateElement,
      handleSettingsClick,
    }),
    [
      handleCreateElement,
      handleDuplicateElement,
      handleRemoveElement,
      handleSelectElement,
      handleSettingsClick,
    ],
  );

  return {
    element,
    handlers,
    settings: {
      isOpen: isSettingsOpen,
      setIsOpen: setIsSettingsOpen,
    },
  };
};

export type UseDesignerReturn = ReturnType<typeof useDesigner>;
