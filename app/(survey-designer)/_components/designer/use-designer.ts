import {useCallback, useMemo, useState} from 'react';
import {
  useSurveyElements,
  useSurveyModel,
  useSurveyScreens,
  useSurveyStoreActions,
} from '@/survey-designer/_store/survey-designer-store';
import {
  AllElementTypes,
  SelectedElement,
  SurveyElementType,
} from '@/types/element';
import {
  getElementToEdit,
  getInitialSelectedElement,
  getNextElementToSelect,
} from './use-designer.utils';

export const useDesigner = () => {
  const model = useSurveyModel();
  const surveyElements = useSurveyElements();
  const surveyScreens = useSurveyScreens();
  const {deleteElement, duplicateElement, insertElement} =
    useSurveyStoreActions();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(() =>
      getInitialSelectedElement(surveyScreens.welcome[0], surveyElements),
    );

  const element = getElementToEdit({
    selectedElement,
    surveyElements,
    surveyScreens,
  });

  const handleSelectElement = useCallback(
    (id: string, type: AllElementTypes) => {
      setSelectedElement({id, type});
    },
    [],
  );

  const handleSettingsClick = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const handleRemoveElement = useCallback(
    (removeId: string) => {
      const elementsBeforeDelete = [...surveyElements];
      if (elementsBeforeDelete.length === 1) return;

      deleteElement({id: removeId});
      if (selectedElement?.id === removeId) {
        const {id, type} = getNextElementToSelect(model, removeId);

        setSelectedElement({id, type});
      }
    },
    [deleteElement, model, selectedElement?.id, surveyElements],
  );

  const handleDuplicateElement = useCallback(
    (duplicateId: string) => {
      const {id, type} = duplicateElement({id: duplicateId}) ?? {};

      if (id && type) {
        setSelectedElement({id, type});
      }
    },
    [duplicateElement],
  );

  const handleCreateElement = useCallback(
    ({
      type = 'short_text',
      index,
    }: {
      type?: SurveyElementType;
      index?: number;
    } = {}) => {
      const insertedElementId = insertElement(
        {
          type,
        },
        index,
      );
      setSelectedElement({id: insertedElementId, type});
    },
    [insertElement],
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
