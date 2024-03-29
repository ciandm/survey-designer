import {useReducer} from 'react';
import {useForm, useFormContext} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {saveResponsesAction} from '@/features/survey/actions/save-responses-action';
import {createSingleStepValidationSchema} from '@/lib/validations/survey';
import {ParsedModelType, SurveyFormState, SurveyScreen} from '@/types/survey';
import {getSiteUrl} from '@/utils/hrefs';
import {buildSurveyConfig, transformResponsesMap} from '@/utils/survey';
import {surveyManagerReducer} from './use-survey.reducer';

type UseSurveyProps = {
  model: ParsedModelType;
  id: string;
  isPreview?: boolean;
};

export const useSurvey = ({model, id, isPreview}: UseSurveyProps) => {
  const {fields} = model;
  const router = useRouter();
  const config = buildSurveyConfig(model);
  const [{screen, currentElementId, responsesMap}, dispatch] = useReducer(
    surveyManagerReducer,
    {
      screen: model.screens.welcome.length ? 'welcome_screen' : 'survey_screen',
      currentElementId: fields[0]?.id ?? null,
      responsesMap: {},
    },
  );
  const initialElement = fields[0];

  const currentElement = {
    element: fields.find((el) => el.id === currentElementId),
    index: fields.findIndex((el) => el.id === currentElementId),
  };

  const form = useForm<SurveyFormState>({
    defaultValues: {
      questionId: initialElement?.id,
      type: initialElement?.type,
      value: [],
    },
    resolver: zodResolver(createSingleStepValidationSchema(fields)),
  });

  const handleStartSurvey = () => {
    if (!fields.length) return;

    const initialElement = fields[0];
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
        initialElement: fields[0],
        screen: model.screens.welcome.length
          ? 'welcome_screen'
          : 'survey_screen',
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
      dispatch({
        type: 'SAVE_RESPONSE',
        payload: {
          questionId: currentElementId,
          type: data.type,
          value: data.value,
        },
      });
      const {next} = config[currentElementId];

      if (next === 'complete') {
        if (isPreview) return handleSetScreen('thank_you_screen');

        try {
          const transformedResponses = transformResponsesMap({
            ...responsesMap,
            [currentElementId]: {
              type: data.type,
              value: data.value,
            },
          });
          router.prefetch(getSiteUrl.completePage({surveyId: id}));
          await saveResponsesAction({
            responses: transformedResponses,
            surveyId: id,
          });
          router.push(getSiteUrl.completePage({surveyId: id}));
        } catch (error) {
          alert('Failed to save survey responses');
          console.error(error);
        }
      }

      const nextElement = fields.find((el) => el.id === next);
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
    const previousElement = fields.find((el) => el.id === previous);

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

export type UseSurveyManagerReturn = ReturnType<typeof useSurvey>;

export const useSurveyFormContext = () => useFormContext<SurveyFormState>();
