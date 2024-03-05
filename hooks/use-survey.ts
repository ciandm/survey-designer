import {useForm, useFormContext} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ElementType} from '@/lib/constants/element';
import {createSingleStepValidationSchema} from '@/survey/_utils/survey';
import {ElementSchemaType} from '@/types/element';
import {
  ParsedModelType,
  SurveyResponsesMap,
  SurveyScreen,
} from '@/types/survey';
import {useSurveyReducer} from './use-survey-reducer';

export interface SurveyFormState {
  questionId: string;
  value: string[];
  type: ElementType;
}

type UseSurveyProps = {
  model: ParsedModelType;
  onSurveySubmit?: (props: {
    data: SurveyFormState;
    handleSetScreen: (screen: SurveyScreen) => void;
    responses: SurveyResponsesMap;
  }) => void;
};

export const useSurvey = ({model, onSurveySubmit}: UseSurveyProps) => {
  const {elements} = model;
  const {state, dispatch} = useSurveyReducer();

  const displayed = getDisplayedElement(elements, state.currentElementId);
  const lastElement = elements[elements.length - 1];

  const form = useForm<SurveyFormState>({
    defaultValues: {
      questionId: displayed.element?.id,
      type: displayed.element?.type,
      value: [],
    },
    resolver: zodResolver(createSingleStepValidationSchema(elements)),
  });

  const handleInitialiseSurvey = () => {
    form.reset({
      questionId: elements[0]?.id,
      type: elements[0]?.type,
      value: [],
    });
    dispatch({
      type: 'INITIALISE_SURVEY',
      payload: {
        initialElement: elements[0],
      },
    });
  };

  const handleRestartSurvey = () => {
    dispatch({
      type: 'RESTART_SURVEY',
    });
  };

  const handleSetScreen = (screen: SurveyScreen) => {
    dispatch({
      type: 'SET_SCREEN',
      payload: {screen},
    });
  };

  const handleSubmit = form.handleSubmit(
    (data) => {
      if (lastElement.id === state.currentElementId) {
        onSurveySubmit?.({
          data,
          handleSetScreen,
          responses: state.responsesMap,
        });
        return;
      }
      const nextElement = elements[displayed.index + 1];

      form.reset({
        questionId: nextElement?.id,
        type: nextElement?.type,
        value: [],
      });
      dispatch({
        type: 'NEXT_ELEMENT',
        payload: {
          nextElement,
          data,
        },
      });
    },
    (errors) => {
      console.log(errors);
    },
  );

  return {
    form,
    screen: state.screen,
    displayed,
    handlers: {
      handleStartSurvey: handleInitialiseSurvey,
      handleRestartSurvey,
      handleSubmit,
    },
  };
};

export type UseSurveyFormReturn = ReturnType<typeof useSurvey>;

export const useSurveyFormContext = () => useFormContext<SurveyFormState>();

function getDisplayedElement(
  elements: ElementSchemaType[],
  currentElementId: string | null,
) {
  const element = elements.find((el) => el.id === currentElementId);
  const index = elements.findIndex((el) => el.id === currentElementId);

  return {element, index};
}
