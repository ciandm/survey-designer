import {FieldSchema} from '@/types/field';
import {ScreenSchema, SurveyScreenKey} from '@/types/screen';

export type FieldsData = {
  [fieldId: string]: FieldSchema;
};

export type ScreensData = {
  [screenId: string]: ScreenSchema;
};

type FieldActions = {
  insertField: (field: Partial<FieldSchema>, index?: number) => FieldSchema;
  deleteField: (field: Pick<FieldSchema, 'id'>) => {next: string} | null;
  duplicateField: (field: Pick<FieldSchema, 'id'>) => FieldSchema | null;
  changeFieldType: (
    field: Pick<FieldSchema, 'id' | 'type'>,
  ) => FieldSchema | null;
  updateField: (
    id: string,
    field: Partial<FieldSchema> | ((fn: FieldSchema) => Partial<FieldSchema>),
  ) => FieldSchema | null;
  setFields: (fields: StoreFields | ((fn: StoreFields) => StoreFields)) => void;
};

type ScreenActions = {
  insertScreen: (args: {key: SurveyScreenKey}) => ScreenSchema;
  updateScreen: (
    args: {id: string; key: SurveyScreenKey},
    screen:
      | Partial<ScreenSchema>
      | ((fn: ScreenSchema) => Partial<ScreenSchema>),
  ) => void;
  deleteScreen: (args: {id: string; key: SurveyScreenKey}) => void;
};

type ChoiceActions = {
  updateChoice: (
    fieldId: string,
    choiceId: string,
    args: {
      value: string;
    },
  ) => void;
  moveChoices: (
    fieldId: string,
    args: {
      newChoices: NonNullable<FieldSchema['properties']['choices']>;
    },
  ) => void;
  deleteChoice: (fieldId: string, args: {choiceId: string}) => void;
  deleteChoices: (fieldId: string) => void;
  duplicateChoice: (fieldId: string, args: {choiceId: string}) => void;
  insertChoice: (fieldId: string) => void;
};

type SurveyActions = {
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  setPublished: (isPublished: boolean) => void;
};

type SurveyDesignerStoreActions = {
  fields: FieldActions;
  choices: ChoiceActions;
  screens: ScreenActions;
  survey: SurveyActions;
};

export type SurveyDesignerStoreState = SurveyDesignerStoreProps & {
  actions: SurveyDesignerStoreActions;
};

export type StoreFields = {
  _entities: string[];
  _length: number;
  data: FieldsData;
};

export type StoreScreen = {
  _entities: string[];
  _length: number;
  data: ScreensData;
};

export type StoreScreens = {
  welcome: StoreScreen;
  thank_you: StoreScreen;
};

export type StoreElements = {
  fields: StoreFields;
  screens: StoreScreens;
};

export type SurveyDesignerStoreProps = {
  elements: StoreElements;
  survey: {
    title?: string;
    description?: string;
    id: string;
    isPublished: boolean;
  };
};
