import {useForm, useFormContext} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {createSingleStepValidationSchema} from '@/lib/validations/survey';
import {
  ParsedModelType,
  SurveyFormState,
  SurveyResponsesMap,
  SurveyScreen,
} from '@/types/survey';
import {buildSurveyConfig} from '@/utils/survey';
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
  const config = buildSurveyConfig(model);
  const {
    state: {screen, currentElementId, responsesMap},
    dispatch,
  } = useSurveyReducer({
    defaultElementId: elements[0]?.id,
  });

  const currentElement = {
    element: elements.find((el) => el.id === currentElementId),
    index: elements.findIndex((el) => el.id === currentElementId),
  };

  const form = useForm<SurveyFormState>({
    defaultValues: {
      questionId: undefined,
      type: undefined,
      value: [],
    },
    resolver: zodResolver(createSingleStepValidationSchema(elements)),
  });

  const handleStartSurvey = () => {
    if (!elements.length) return;

    const initialElement = elements[0];
    form.reset({
      questionId: initialElement?.id,
      type: initialElement?.type,
      value: [],
    });
    dispatch({
      type: 'START_SURVEY',
      payload: {
        initialElement: initialElement,
      },
    });
  };

  const handleRestartSurvey = () => {
    dispatch({
      type: 'RESTART_SURVEY',
      payload: {
        initialElement: elements[0],
      },
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
      if (!currentElementId) return;
      const {next} = config[currentElementId];

      if (next === 'complete') {
        return onSurveySubmit?.({
          data,
          handleSetScreen,
          responses: responsesMap,
        });
      }

      const nextElement = elements.find((el) => el.id === next);
      if (!nextElement) return;

      const {value} = responsesMap[nextElement.id] || {};

      form.reset({
        questionId: nextElement?.id,
        type: nextElement?.type,
        value: value ?? [],
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
    if (!currentElementId) return;
    const {previous} = config[currentElementId];
    const previousElement = elements.find((el) => el.id === previous);

    if (!previousElement) return;
    const prevResponse = responsesMap[previousElement.id];

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
    currentElement,
    handlers: {
      handleStartSurvey,
      handleRestartSurvey,
      handleSubmit,
      handleGoBack,
    },
  };
};

export type UseSurveyFormReturn = ReturnType<typeof useSurvey>;

export const useSurveyFormContext = () => useFormContext<SurveyFormState>();
