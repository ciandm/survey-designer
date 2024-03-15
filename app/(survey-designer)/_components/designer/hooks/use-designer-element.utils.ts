import {StoreElements} from '@/survey-designer/_store/designer-store.types';
import {FieldSchema} from '@/types/field';
import {ScreenSchema} from '@/types/screen';

export const getInitialSelectedElement = (
  elements: StoreElements,
): FieldSchema | ScreenSchema | null => {
  const {fields, screens} = elements;

  if (screens.welcome._length > 0) {
    return screens.welcome.data[screens.welcome._entities[0]];
  }

  const firstElementId = fields._entities[0];

  if (firstElementId && fields.data[firstElementId]) {
    return fields.data[firstElementId];
  }

  return null;
};

type GetCurrentElementArgs = {
  id?: string;
  elements: StoreElements;
};

export const getElementByIdWithFallback = ({
  id = '',
  elements,
}: GetCurrentElementArgs): FieldSchema | ScreenSchema | null => {
  let element = null;

  if (elements.fields.data[id]) {
    element = elements.fields.data[id];
  } else if (elements.screens.welcome.data[id]) {
    element = elements.screens.welcome.data[id];
  } else if (elements.screens.thank_you.data[id]) {
    element = elements.screens.thank_you.data[id];
  }

  if (!element) {
    element = getInitialSelectedElement(elements);
  }

  return element;
};
