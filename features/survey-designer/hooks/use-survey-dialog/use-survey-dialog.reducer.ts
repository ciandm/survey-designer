export type SurveyActionsState = {
  deleteDialogOptions: {
    isOpen: boolean;
    data: {
      id: string;
      title: string;
    } | null;
  };
  duplicateDialogOptions: {
    isOpen: boolean;
    data: {
      id: string;
      title: string;
      description: string;
    } | null;
  };
};

const KEY_MAPPER = {
  delete: 'deleteDialogOptions',
  duplicate: 'duplicateDialogOptions',
} as const;

export type DialogKey = keyof typeof KEY_MAPPER;

type ReducerAction =
  | {
      type: 'TOGGLE_DIALOG';
      payload: {
        key: DialogKey;
        isOpen: boolean;
      };
    }
  | {
      type: 'SET_DELETE_DIALOG_DATA';
      payload: {
        data: {
          id: string;
          title: string;
          description?: string;
        };
      };
    }
  | {
      type: 'SET_DUPLICATE_DIALOG_DATA';
      payload: {
        data: {
          id: string;
          title: string;
          description: string;
        };
      };
    };

export const surveyActionsReducer = (
  state: SurveyActionsState,
  action: ReducerAction,
): SurveyActionsState => {
  switch (action.type) {
    case 'TOGGLE_DIALOG':
      return {
        ...state,
        [KEY_MAPPER[action.payload.key]]: {
          ...state[KEY_MAPPER[action.payload.key] as keyof SurveyActionsState],
          ...(!action.payload.isOpen && {data: null}),
          isOpen: action.payload.isOpen,
        },
      };
    case 'SET_DELETE_DIALOG_DATA':
      return {
        ...state,
        deleteDialogOptions: {
          ...state.deleteDialogOptions,
          data: action.payload.data,
        },
      };
    case 'SET_DUPLICATE_DIALOG_DATA':
      return {
        ...state,
        duplicateDialogOptions: {
          ...state.duplicateDialogOptions,
          data: action.payload.data,
        },
      };
    default:
      return state;
  }
};

export const initialState: SurveyActionsState = {
  deleteDialogOptions: {
    isOpen: false,
    data: null,
  },
  duplicateDialogOptions: {
    isOpen: false,
    data: null,
  },
};
