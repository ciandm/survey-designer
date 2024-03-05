import {useState} from 'react';
import {useFieldArray, useForm, useFormContext} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ElementType} from '@/lib/constants/element';
import {createSurveyValidationSchema} from '@/survey/_utils/survey';
import {ElementSchemaType} from '@/types/element';
import {ParsedModelType} from '@/types/survey';

type Screen = 'welcome_screen' | 'survey_screen' | 'thank_you_screen';

export interface SurveyFormState {
  fields: {questionId: string; value: string[]; type: ElementType}[];
}

type UseSurveyProps = {
  model: ParsedModelType;
  onSurveySubmit?: (props: {
    data: SurveyFormState;
    setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  }) => void;
};

export const useSurvey = ({model, onSurveySubmit}: UseSurveyProps) => {
  const {elements} = model;
  const [currentElementId, setCurrentElementId] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>('welcome_screen');

  const displayed = getDisplayedElement(elements, currentElementId);

  const lastElement = elements[elements.length - 1];

  const form = useForm<SurveyFormState>({
    defaultValues: {
      fields: elements.map((element) => ({
        questionId: element.id,
        type: element.type,
        value: [],
      })),
    },
    resolver: zodResolver(createSurveyValidationSchema(elements)),
  });

  const handleStartSurvey = () => {
    setCurrentElementId(elements[0]?.id);
    setScreen('survey_screen');
  };

  const handleRestartSurvey = () => {
    setCurrentElementId(null);
    setScreen('welcome_screen');
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (lastElement.id === currentElementId) {
      onSurveySubmit?.({data, setScreen});
      return;
    }
    setCurrentElementId(elements[displayed.index + 1]?.id);
  });

  const {fields} = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  return {
    form,
    fields,
    screen,
    displayed,
    handlers: {
      handleStartSurvey,
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
