import {useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ElementType} from '@/lib/constants/element';
import {createSurveyValidationSchema} from '@/survey/_utils/survey';
import {ElementSchemaType} from '@/types/element';
import {ParsedModelType} from '@/types/survey';

type Screen = 'welcome_screen' | 'survey_screen' | 'thank_you_screen';

interface SurveyFormState {
  fields: {questionId: string; value: string[]; type: ElementType}[];
}

type UseSurveyFormProps = {
  model: ParsedModelType;
  onSurveySubmit?: (props: {
    data: SurveyFormState;
    setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  }) => void;
};

export const useSurveyForm = ({model, onSurveySubmit}: UseSurveyFormProps) => {
  const {elements} = model;
  const [currentElementId, setCurrentElementId] = useState<string>();
  const [screen, setScreen] = useState<Screen>('welcome_screen');

  const {displayedElement, displayedElementIndex} = getDisplayedElement(
    elements,
    currentElementId,
  );

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

  const handleSubmit = form.handleSubmit((data) => {
    if (lastElement.id === currentElementId) {
      onSurveySubmit?.({data, setScreen});
      return;
    }
    setCurrentElementId(elements[displayedElementIndex + 1]?.id);
  });

  const {fields} = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  return {
    form,
    fields,
    screen,
    displayedElement,
    displayedElementIndex,
    handlers: {
      handleStartSurvey,
      handleSubmit,
    },
  };
};

function getDisplayedElement(
  elements: ElementSchemaType[],
  currentElementId?: string,
) {
  const displayedElement = elements.find((el) => el.id === currentElementId);
  const displayedElementIndex = elements.findIndex(
    (el) => el.id === currentElementId,
  );

  return {displayedElement, displayedElementIndex};
}
