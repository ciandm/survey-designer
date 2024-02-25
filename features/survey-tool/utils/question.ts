import {ID_PREFIXES} from '@/lib/constants/element';
import {
  ChoicesSchema,
  ElementSchema,
  SORT_ORDER,
  SortOrder,
  SurveySchema,
} from '@/lib/validations/survey';

export const getElementIndex = (
  elements: ElementSchema[],
  elementId?: string,
) => {
  return elements.findIndex((q) => q.id === elementId);
};

export const getNextElement = (
  elements: ElementSchema[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return elements[index + 1];
};

export const getPreviousElement = (
  elements: ElementSchema[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return elements[index - 1];
};

export const getElementById = (
  elements: ElementSchema[],
  elementId?: string,
) => {
  return elements.find((q) => q.id === elementId);
};

export const getCanGoBack = (elements: ElementSchema[], elementId?: string) => {
  const index = getElementIndex(elements, elementId);
  return index > 0;
};

export const getCanGoForward = (
  elements: ElementSchema[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return index < elements.length - 1;
};

export const getIsLastElement = (
  elements: ElementSchema[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return index === elements.length - 1;
};

export const getElementStates = (
  elements: ElementSchema[],
  elementId: string,
) => {
  const canGoBack = getCanGoBack(elements, elementId);
  const canGoForward = getCanGoForward(elements, elementId);
  const questionIndex = getElementIndex(elements, elementId);
  const isLastQuestion = getIsLastElement(elements, elementId);
  const nextQuestion = getNextElement(elements, elementId);
  const prevQuestion = getPreviousElement(elements, elementId);

  return {
    canGoBack,
    canGoForward,
    questionIndex,
    isLastQuestion,
    nextQuestion,
    prevQuestion,
  };
};

function hasChoices(element: ElementSchema) {
  return element.type === 'multiple_choice' || element.type === 'single_choice';
}

export function sortChoices(survey: SurveySchema): SurveySchema {
  const {elements} = survey;
  const copiedSurvey = {...survey};

  const newElements = elements.map((el) => {
    const element = {...el, properties: {...el.properties}};
    if (hasChoices(element)) {
      switch (element.properties.sort_order) {
        case 'asc':
          element.properties.choices = element.properties.choices?.reverse();
          break;
        case 'random':
          element.properties.choices = randomiseChoices(
            element.properties.choices,
          );
          break;
        default:
          break;
      }
    }

    return element;
  });

  copiedSurvey.elements = newElements;
  return copiedSurvey;
}

function randomiseChoices(choices: ChoicesSchema = []) {
  const copiedChoices = [...choices];

  return copiedChoices.sort((choice) => {
    if (choice.id.startsWith(ID_PREFIXES.OTHER_CHOICE)) return 1;

    return Math.random() - 0.5;
  });
}
