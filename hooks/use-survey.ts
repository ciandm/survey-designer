import {useForm, useFormContext} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {createSingleStepValidationSchema} from '@/lib/validations/survey';
import {ElementSchemaType} from '@/types/element';
import {
  ParsedModelType,
  SurveyFormState,
  SurveyResponsesMap,
  SurveyScreen,
} from '@/types/survey';
import {useSurveyReducer} from './use-survey-reducer';

type UseSurveyProps = {
  model: ParsedModelType;
  onSurveySubmit?: (props: {
    data: SurveyFormState;
    handleSetScreen: (screen: SurveyScreen) => void;
    responses: SurveyResponsesMap;
  }) => Promise<void> | void;
};

export const useSurvey = ({model, onSurveySubmit}: UseSurveyProps) => {
  const {elements} = model;
  const {
    state: {screen, currentElementId, responsesMap},
    dispatch,
  } = useSurveyReducer(model);

  const displayed = getDisplayedElement(elements, currentElementId);
  const isLastElement = displayed.index === elements.length - 1;
  const isFirstElement = displayed.index === 0;

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
        initialElement: elements[0] ?? null,
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
    async (data) => {
      if (isLastElement) {
        return onSurveySubmit?.({
          data,
          handleSetScreen,
          responses: responsesMap,
        });
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

  const handleGoBack = () => {
    const previousElement = elements[displayed.index - 1];
    const prevResponse = responsesMap[previousElement?.id];
    form.reset({
      questionId: previousElement?.id,
      type: prevResponse?.type,
      value: prevResponse?.value || [],
    });
    dispatch({
      type: 'PREVIOUS_ELEMENT',
      payload: {
        previousElement,
      },
    });
  };

  return {
    form,
    screen,
    displayed,
    isFirstElement,
    isLastElement,
    handlers: {
      handleStartSurvey: handleInitialiseSurvey,
      handleRestartSurvey,
      handleSubmit,
      handleGoBack,
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
