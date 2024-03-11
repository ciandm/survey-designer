import {ElementSchema, ScreenSchema} from '@/types/element';
import {ParsedModelType} from '@/types/survey';

export const getInitialSelectedId = (model: ParsedModelType) => {
  const {elements, screens} = model;
  const welcomeScreen = screens.welcome[0];

  if (welcomeScreen) {
    return welcomeScreen.id;
  }
  const firstElement = elements[0];
  if (firstElement) {
    return firstElement.id;
  }
  return null;
};

type GetCurrentElementArgs = {
  id: string;
  model: ParsedModelType;
};

function findSurveyElementById(id: string, model: ParsedModelType) {
  const {elements, screens} = model;
  const prefix = id.slice(0, 2);
  switch (prefix) {
    case 'el':
      return elements.find((element) => element.id === id) || null;
    case 'sc':
      return screens.welcome.find((screen) => screen.id === id) || null;
    default:
      return null;
  }
}

export const getElementByIdWithFallback = ({
  id,
  model,
}: GetCurrentElementArgs): ElementSchema | ScreenSchema | null => {
  let element = null;

  element = findSurveyElementById(id, model);

  if (!element) {
    const initialId = getInitialSelectedId(model);

    if (initialId) {
      element = findSurveyElementById(initialId, model);
    }
  }

  return element;
};

export function getNextElementToSelect(
  model: ParsedModelType,
  elementId: string,
) {
  const {elements, screens} = model;
  const hasWelcomeScreen = screens.welcome.length > 0;

  const questionIndex = elements.findIndex(
    (element) => element.id === elementId,
  );

  if (hasWelcomeScreen && questionIndex === 0) {
    return screens.welcome[0];
  }

  const prevElement = elements[questionIndex - 1];
  const nextElement = elements[questionIndex + 1];

  return prevElement || nextElement || null;
}
