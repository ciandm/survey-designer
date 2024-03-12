import {FieldSchema} from '@/types/field';
import {ScreenSchema} from '@/types/screen';
import {ParsedModelType} from '@/types/survey';

export const getInitialSelectedId = (model: ParsedModelType) => {
  const {fields, screens} = model;
  const welcomeScreen = screens.welcome[0];

  if (welcomeScreen) {
    return welcomeScreen.id;
  }
  const firstElement = fields[0];
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
  const {fields, screens} = model;
  const prefix = id.slice(0, 2);
  switch (prefix) {
    case 'el':
      return fields.find((field) => field.id === id) || null;
    case 'sc':
      const welcomeScreen =
        screens.welcome.find((screen) => screen.id === id) || null;
      if (welcomeScreen) {
        return welcomeScreen;
      }
      const thankYouScreen =
        screens.thank_you.find((screen) => screen.id === id) || null;
      if (thankYouScreen) {
        return thankYouScreen;
      }
      return null;
    default:
      return null;
  }
}

export const getElementByIdWithFallback = ({
  id,
  model,
}: GetCurrentElementArgs): FieldSchema | ScreenSchema | null => {
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

export function getNextElementToSelect(model: ParsedModelType, id: string) {
  const {fields, screens} = model;
  const hasWelcomeScreen = screens.welcome.length > 0;

  const questionIndex = fields.findIndex((field) => field.id === id);

  if (hasWelcomeScreen && questionIndex === 0) {
    return screens.welcome[0];
  }

  const prevElement = fields[questionIndex - 1];
  const nextElement = fields[questionIndex + 1];

  return prevElement || nextElement || null;
}
