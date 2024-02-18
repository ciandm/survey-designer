import {ElementSchema} from '@/lib/validations/survey';

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
