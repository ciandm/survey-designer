import {useCallback, useMemo, useState} from 'react';
import {useQueryState} from 'nuqs';
import {
  useSurveyModel,
  useSurveyStoreActions,
} from '@/survey-designer/_store/survey-designer-store';
import {FieldType} from '@/types/field';
import {SurveyScreenKey} from '@/types/screen';
import {
  getElementByIdWithFallback,
  getInitialSelectedId,
  getNextElementToSelect,
} from './use-designer.utils';

export const useDesigner = () => {
  const model = useSurveyModel();
  const {fields} = model;
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

  const handleRemoveField = useCallback(
    (removeId: string) => {
      if (fields.length === 1) return;

      storeActions.deleteField({id: removeId});
      if (selectedId === removeId) {
        const {id} = getNextElementToSelect(model, removeId);

        setSelectedId(id);
      }
    },
    [storeActions, model, selectedId, fields, setSelectedId],
  );

  const handleDuplicateElement = useCallback(
    (duplicateId: string) => {
      const {id} = storeActions.duplicateField({id: duplicateId}) ?? {};

      if (id) {
        setSelectedId(id);
      }
    },
    [storeActions, setSelectedId],
  );

  const handleCreateField = useCallback(
    ({
      type = 'short_text',
      index,
    }: {
      type?: FieldType;
      index?: number;
    } = {}) => {
      const {id} = storeActions.insertField(
        {
          type,
        },
        index,
      );
      setSelectedId(id);
    },
    [storeActions, setSelectedId],
  );

  const handleCreateScreen = useCallback(
    ({key}: {key: SurveyScreenKey}) => {
      const {id} = storeActions.insertScreen(key);
      setSelectedId(id);
    },
    [storeActions, setSelectedId],
  );

  const handleRemoveScreen = useCallback(
    ({key, id: removeId}: {key: SurveyScreenKey; id: string}) => {
      storeActions.removeScreen({key, id: removeId});

      if (selectedId === removeId) {
        const {id} = getNextElementToSelect(model, removeId);

        setSelectedId(id);
      }
    },
    [storeActions, model, selectedId, setSelectedId],
  );

  const handlers = useMemo(
    () => ({
      handleSelectElement,
      handleRemoveElement: handleRemoveField,
      handleDuplicateElement,
      handleCreateElement: handleCreateField,
      handleSettingsClick,
      handleCreateScreen,
      handleRemoveScreen,
    }),
    [
      handleCreateField,
      handleDuplicateElement,
      handleRemoveField,
      handleSelectElement,
      handleSettingsClick,
      handleCreateScreen,
      handleRemoveScreen,
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
export type UseDesignerHandlers = UseDesignerReturn['handlers'];
