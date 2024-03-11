import {
  ElementSchemaType,
  ScreenSchemaType,
  SelectedElement,
} from '@/types/element';
import {ParsedModelType} from '@/types/survey';
import {getIsScreenType} from '@/utils/survey';

export const getInitialSelectedElement = (
  welcomeScreen: ScreenSchemaType,
  surveyElements: ElementSchemaType[],
) => {
  if (welcomeScreen) {
    return {
      id: welcomeScreen.id,
      type: welcomeScreen.type,
    };
  }
  const firstElement = surveyElements[0];
  if (firstElement) {
    return {
      id: firstElement.id,
      type: firstElement.type,
    };
  }
  return null;
};

type GetCurrentElementArgs = {
  selectedElement: SelectedElement | null;
  surveyElements: ElementSchemaType[];
  surveyScreens: {welcome: ScreenSchemaType[]; thank_you: ScreenSchemaType[]};
};

export const getElementToEdit = ({
  selectedElement,
  surveyElements,
  surveyScreens,
}: GetCurrentElementArgs) => {
  if (getIsScreenType(selectedElement?.type)) {
    const key =
      selectedElement?.type === 'thank_you_screen' ? 'thank_you' : 'welcome';
    return (
      surveyScreens[key].find((el) => el.id === selectedElement?.id) || null
    );
  }

  return surveyElements.find((el) => el.id === selectedElement?.id) || null;
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
