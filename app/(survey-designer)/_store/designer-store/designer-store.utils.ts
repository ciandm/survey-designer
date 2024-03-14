import {generateId} from 'lucia';
import {FieldSchema} from '@/types/field';
import {ScreenSchema} from '@/types/screen';
import {SurveyWithParsedModelType} from '@/types/survey';
import {
  FieldsData,
  ScreensData,
  StoreFields,
  StoreScreen,
  SurveyDesignerStoreProps,
} from './designer-store.types';

export const fieldsObjectToList = ({_entities: _order, data}: StoreFields) => {
  return Object.values(data)
    .sort((a, b) => {
      return _order.indexOf(a.id) - _order.indexOf(b.id);
    })
    .map((field) => field);
};

export const fieldsListToFieldsObject = (fields: FieldSchema[]) => {
  return fields.reduce<FieldsData>((acc, field) => {
    acc[field.id] = field;
    return acc;
  }, {} as FieldsData);
};

export const screensObjectToList = (screens: ScreensData) =>
  Object.entries(screens).map(([, screen]) => screen);

export const transformStoreScreen = (screen: ScreenSchema[] = []) => {
  return screen?.reduce<StoreScreen>(
    (acc, screen) => {
      acc.data[screen.id] = screen;
      acc._entities.push(screen.id);
      acc._length++;
      return acc;
    },
    {
      data: {},
      _entities: [],
      _length: 0,
    } as StoreScreen,
  );
};

export const buildInitialState = (
  initProps: Partial<SurveyWithParsedModelType> = {},
): SurveyDesignerStoreProps => {
  const fields = initProps.model?.fields.reduce((acc, field) => {
    acc[field.id] = field;
    return acc;
  }, {} as FieldsData);
  const welcomeScreen = transformStoreScreen(initProps.model?.screens.welcome);
  const thankYouScreen = transformStoreScreen(
    initProps.model?.screens.thank_you,
  );

  return {
    survey: {
      id: initProps?.id ?? generateId(15),
      isPublished: initProps?.is_published ?? false,
    },
    elements: {
      fields: {
        _length: initProps.model?.fields.length ?? 0,
        _entities: initProps.model?.fields.map((field) => field.id) ?? [],
        data: fields ?? {},
      },
      screens: {
        thank_you: thankYouScreen,
        welcome: welcomeScreen,
      },
    },
  };
};
