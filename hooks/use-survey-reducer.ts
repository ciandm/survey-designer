import {useReducer} from 'react';
import {ElementSchemaType} from '@/types/element';
import {SurveyResponsesMap, SurveyScreen} from '@/types/survey';
import {SurveyFormState} from './use-survey';

type SurveyReducerState = {
  screen: SurveyScreen;
  currentElementId: string | null;
  responsesMap: SurveyResponsesMap;
};

type SurveyReducerAction =
  | {
      type: 'INITIALISE_SURVEY';
      payload: {
        initialElement: ElementSchemaType;
      };
    }
  | {
      type: 'RESTART_SURVEY';
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
        nextElement: ElementSchemaType;
        data: SurveyFormState;
      };
    };

function reducer(
  state: SurveyReducerState,
  action: SurveyReducerAction,
): SurveyReducerState {
  switch (action.type) {
    case 'INITIALISE_SURVEY':
      return {
        ...state,
        currentElementId: action.payload.initialElement.id,
        screen: 'survey_screen',
      };
    case 'RESTART_SURVEY':
      return {
        ...state,
        currentElementId: null,
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
    default:
      return state;
  }
}

export const useSurveyReducer = () => {
  const [state, dispatch] = useReducer(reducer, {
    screen: 'welcome_screen',
    currentElementId: null,
    responsesMap: {},
  });

  return {
    state,
    dispatch,
  };
};
