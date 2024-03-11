import {useReducer} from 'react';
import {ElementSchema} from '@/types/element';
import {
  SurveyFormState,
  SurveyResponsesMap,
  SurveyScreen,
} from '@/types/survey';

type SurveyReducerState = {
  screen: SurveyScreen;
  currentElementId: string | null;
  responsesMap: SurveyResponsesMap;
};

type SurveyReducerAction =
  | {
      type: 'START_SURVEY';
      payload: {
        initialElement: ElementSchema | null;
      };
    }
  | {
      type: 'RESTART_SURVEY';
      payload: {
        initialElement: ElementSchema;
      };
    }
  | {
      type: 'SET_SCREEN';
      payload: {
        screen: SurveyScreen;
      };
    }
  | {
      type: 'NEXT_ELEMENT';
      payload: {
        nextElement: ElementSchema;
        data: SurveyFormState;
      };
    }
  | {
      type: 'PREVIOUS_ELEMENT';
      payload: {
        previousElement: ElementSchema;
      };
    };

function reducer(
  state: SurveyReducerState,
  action: SurveyReducerAction,
): SurveyReducerState {
  switch (action.type) {
    case 'START_SURVEY':
      const initialElement = action.payload.initialElement;
      return {
        ...state,
        responsesMap: {},
        currentElementId: initialElement?.id ?? null,
        screen: 'survey_screen',
      };
    case 'RESTART_SURVEY':
      return {
        ...state,
        currentElementId: action.payload.initialElement.id,
        screen: 'welcome_screen',
        responsesMap: {},
      };
    case 'SET_SCREEN':
      return {
        ...state,
        screen: action.payload.screen,
      };
    case 'NEXT_ELEMENT':
      return {
        ...state,
        currentElementId: action.payload.nextElement.id,
        responsesMap: {
          ...state.responsesMap,
          [action.payload.data.questionId]: {
            value: action.payload.data.value,
            type: action.payload.data.type,
          },
        },
      };
    case 'PREVIOUS_ELEMENT':
      return {
        ...state,
        currentElementId: action.payload.previousElement.id,
      };
    default:
      return state;
  }
}

type UseSurveyReducerProps = {
  defaultScreen?: SurveyScreen;
  defaultElementId?: string;
};

export const useSurveyReducer = ({
  defaultElementId,
  defaultScreen,
}: UseSurveyReducerProps) => {
  const [state, dispatch] = useReducer(reducer, {
    screen: defaultScreen ?? 'welcome_screen',
    currentElementId: defaultElementId ?? null,
    responsesMap: {},
  });

  return {
    state,
    dispatch,
  };
};
