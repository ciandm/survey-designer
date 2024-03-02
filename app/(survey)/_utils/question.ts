import {ID_PREFIXES} from '@/lib/constants/element';
import {ChoicesSchemaType, ElementSchemaType} from '@/types/element';
import {ParsedModelType} from '@/types/survey';

export const getElementIndex = (
  elements: ElementSchemaType[],
  elementId?: string,
) => {
  return elements.findIndex((q) => q.id === elementId);
};

export const getNextElement = (
  elements: ElementSchemaType[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return elements[index + 1];
};

export const getPreviousElement = (
  elements: ElementSchemaType[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return elements[index - 1];
};

export const getElementById = (
  elements: ElementSchemaType[],
  elementId?: string,
) => {
  return elements.find((q) => q.id === elementId);
};

export const getCanGoBack = (
  elements: ElementSchemaType[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return index > 0;
};

export const getCanGoForward = (
  elements: ElementSchemaType[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return index < elements.length - 1;
};

export const getIsLastElement = (
  elements: ElementSchemaType[],
  elementId?: string,
) => {
  const index = getElementIndex(elements, elementId);
  return index === elements.length - 1;
};

export const getElementStates = (
  elements: ElementSchemaType[],
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

function hasChoices(element: ElementSchemaType) {
  return element.type === 'multiple_choice' || element.type === 'single_choice';
}

export function sortChoices(model: ParsedModelType): ParsedModelType {
  const {elements} = model;
  const copiedSchema = {...model};

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

  copiedSchema.elements = newElements;
  return copiedSchema;
}

function randomiseChoices(choices: ChoicesSchemaType = []) {
  const copiedChoices = [...choices];

  return copiedChoices.sort((choice) => {
    if (choice.id.startsWith(ID_PREFIXES.OTHER_CHOICE)) return 1;

    return Math.random() - 0.5;
  });
}
