import {useReducer} from 'react';
import {
  DialogKey,
  initialState,
  surveyActionsReducer,
} from './use-survey-dialog.reducer';

type DeleteDialogData = {
  id: string;
  title: string;
};

type DuplicateDialogData = DeleteDialogData & {
  description?: string;
};

export const useSurveyDialog = () => {
  const [state, dispatch] = useReducer(surveyActionsReducer, initialState);

  const handleTriggerDuplicateDialog = ({
    id,
    title,
    description = '',
  }: DuplicateDialogData) => {
    dispatch({
      type: 'TOGGLE_DIALOG',
      payload: {key: 'duplicate', isOpen: true},
    });
    dispatch({
      type: 'SET_DUPLICATE_DIALOG_DATA',
      payload: {data: {id, title, description}},
    });
  };

  const handleTriggerDeleteDialog = ({id, title}: DeleteDialogData) => {
    dispatch({
      type: 'TOGGLE_DIALOG',
      payload: {key: 'delete', isOpen: true},
    });
    dispatch({
      type: 'SET_DELETE_DIALOG_DATA',
      payload: {data: {id, title}},
    });
  };

  const handleOpenChange = (isOpen: boolean, key: DialogKey) => {
    dispatch({
      type: 'TOGGLE_DIALOG',
      payload: {key, isOpen},
    });
  };

  return {
    state,
    dispatch,
    handleTriggerDuplicateDialog,
    handleTriggerDeleteDialog,
    handleOpenChange,
  };
};
