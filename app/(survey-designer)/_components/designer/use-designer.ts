import {useCallback, useMemo, useState} from 'react';
import {
  useSurveyModel,
  useSurveyStoreActions,
} from '@/survey-designer/_store/survey-designer-store';
import {
  ElementType,
  SelectedElement,
  SurveyElementTypes,
} from '@/types/element';
import {
  getElementToEdit,
  getInitialSelectedElement,
  getNextElementToSelect,
} from './use-designer.utils';

export const useDesigner = () => {
  const model = useSurveyModel();
  const {elements, screens} = model;
  const storeActions = useSurveyStoreActions();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(() =>
      getInitialSelectedElement(screens.welcome[0], elements),
    );

  const element = getElementToEdit({
    selectedElement,
    elements,
    screens,
  });

  const handleSelectElement = useCallback(
    (id: string, type: SurveyElementTypes) => {
      setSelectedElement({id, type});
    },
    [],
  );

  const handleSettingsClick = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const handleRemoveElement = useCallback(
    (removeId: string) => {
      const elementsBeforeDelete = [...elements];
      if (elementsBeforeDelete.length === 1) return;

      storeActions.deleteElement({id: removeId});
      if (selectedElement?.id === removeId) {
        const {id, type} = getNextElementToSelect(model, removeId);

        setSelectedElement({id, type});
      }
    },
    [storeActions, model, selectedElement?.id, elements],
  );

  const handleDuplicateElement = useCallback(
    (duplicateId: string) => {
      const {id, type} = storeActions.duplicateElement({id: duplicateId}) ?? {};

      if (id && type) {
        setSelectedElement({id, type});
      }
    },
    [storeActions],
  );

  const handleCreateElement = useCallback(
    ({
      type = 'short_text',
      index,
    }: {
      type?: ElementType;
      index?: number;
    } = {}) => {
      const insertedElementId = storeActions.insertElement(
        {
          type,
        },
        index,
      );
      setSelectedElement({id: insertedElementId, type});
    },
    [storeActions],
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
