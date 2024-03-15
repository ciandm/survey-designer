import {FieldSchema, FieldType} from '@/types/field';
import {SurveyResponsesMap, SurveyScreen} from '@/types/survey';

type SurveyReducerState = {
  screen: SurveyScreen;
  currentElementId: string | null;
  responsesMap: SurveyResponsesMap;
};

type SurveyReducerAction =
  | {
      type: 'START_SURVEY';
      payload: {
        initialElement: FieldSchema | null;
      };
    }
  | {
      type: 'RESTART_SURVEY';
      payload: {
        initialElement: FieldSchema;
        screen: SurveyScreen;
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
        nextElement: FieldSchema;
      };
    }
  | {
      type: 'PREVIOUS_ELEMENT';
      payload: {
        previousElement: FieldSchema;
      };
    }
  | {
      type: 'SAVE_RESPONSE';
      payload: {
        questionId: string;
        type: FieldType;
        value: string[];
      };
    };

export function surveyManagerReducer(
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
        screen: action.payload.screen,
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
      };
    case 'PREVIOUS_ELEMENT':
      return {
        ...state,
        currentElementId: action.payload.previousElement.id,
      };
    case 'SAVE_RESPONSE':
      return {
        ...state,
        responsesMap: {
          ...state.responsesMap,
          [action.payload.questionId]: {
            type: action.payload.type,
            value: action.payload.value,
          },
        },
      };
    default:
      return state;
  }
}
