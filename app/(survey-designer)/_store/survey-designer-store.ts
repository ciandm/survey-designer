import {isEqual, merge, omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {createStore, StoreApi, useStore} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {FieldSchema} from '@/types/field';
import {ScreenSchema, SurveyScreenKey} from '@/types/screen';
import {ParsedModelType, SurveyWithParsedModelType} from '@/types/survey';
import {createContext} from '@/utils/context';
import {buildNewFieldHelper, buildNewScreenHelper} from '@/utils/survey';

type SurveyDesignerStoreProps = {
  id: string;
  model: ParsedModelType;
  savedSchema: ParsedModelType;
  isPublished: boolean;
};

type ElementStoreActions = {
  insertField: (field: Partial<FieldSchema>, index?: number) => FieldSchema;
  deleteField: (field: Pick<FieldSchema, 'id'>) => FieldSchema[];
  duplicateField: (field: Pick<FieldSchema, 'id'>) => FieldSchema | null;
  changeFieldType: (field: Pick<FieldSchema, 'id' | 'type'>) => void;
  updateField: (field: Partial<FieldSchema> & {id: string}) => void;
  setFields: (
    fields:
      | FieldSchema[]
      | ((fn: ParsedModelType['fields']) => ParsedModelType['fields']),
  ) => void;
};

type QuestionChoiceStoreActions = {
  updateQuestionChoice: (params: {
    fieldId: string;
    newChoice: {
      id: string;
      value: string;
    };
  }) => void;
  moveChoices: (params: {
    fieldId: string;
    newChoices: NonNullable<FieldSchema['properties']['choices']>;
  }) => void;
  deleteQuestionChoice: (params: {fieldId: string; choiceId: string}) => void;
  deleteChoices: (params: {fieldId: string}) => void;
  duplicateQuestionChoice: (params: {
    fieldId: string;
    choiceId: string;
  }) => void;
  insertQuestionChoice: (params: {fieldId: string}) => void;
};

type SurveySchemaStoreActions = {
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  setSchema: (model: ParsedModelType) => void;
  setSavedSchema: (model: ParsedModelType) => void;
  setPublished: (isPublished: boolean) => void;
};

type SurveyScreenStoreActions = {
  insertScreen: (key: SurveyScreenKey) => ScreenSchema;
  updateScreen: (
    args: {id: string; key: SurveyScreenKey},
    data: Partial<ScreenSchema>,
  ) => void;
  removeScreen: (args: {id: string; key: SurveyScreenKey}) => void;
};

type SurveyDesignerStoreActions = SurveySchemaStoreActions &
  ElementStoreActions &
  QuestionChoiceStoreActions &
  SurveyScreenStoreActions;

export type SurveyDesignerStoreState = SurveyDesignerStoreProps & {
  actions: SurveyDesignerStoreActions;
};

export const createSurveyDesignerStore = (
  initProps: Partial<SurveyWithParsedModelType> = {},
) => {
  const model: ParsedModelType = merge(
    {
      title: '',
      fields: [],
      version: 1,
      screens: {
        welcome: [],
        thank_you: [],
      },
    } as ParsedModelType,
    initProps?.model,
  );

  const initialState: SurveyDesignerStoreProps = {
    id: initProps?.id ?? uuidv4(),
    isPublished: initProps?.is_published ?? false,
    model,
    savedSchema: model,
  };

  return createStore<SurveyDesignerStoreState>()(
    immer((set, get) => ({
      ...initialState,
      actions: {
        updateTitle: (title) => {
          set((state) => {
            state.model.title = title;
          });
        },
        updateDescription: (description) => {
          set((state) => {
            state.model.description = description;
          });
        },
        insertField: (field, insertAtIndex) => {
          const newElement = buildNewFieldHelper(field.type ?? 'short_text', {
            ...field,
          });

          set((state) => {
            if (insertAtIndex !== undefined) {
              state.model.fields.splice(insertAtIndex, 0, newElement);
              return;
            }

            state.model.fields.push(newElement);
          });

          return newElement;
        },
        deleteField: ({id}) => {
          let fields = get().model.fields;
          set((state) => {
            fields = fields.filter((q) => q.id !== id);

            state.model.fields = fields;
          });

          return fields;
        },
        duplicateField: ({id: duplicateId}) => {
          let newElement: FieldSchema | null = null;

          set((state) => {
            const element = state.model.fields.find(
              (q) => q.id === duplicateId,
            );
            if (!element) return state;

            const {id, ...rest} = element;
            newElement = buildNewFieldHelper(element.type, {
              ...rest,
              text: element.text ? `${element.text} (copy)` : '',
            });

            const indexOfFieldToDuplicate = state.model.fields.findIndex(
              (q) => q.id === id,
            );
            state.model.fields.splice(
              indexOfFieldToDuplicate + 1,
              0,
              newElement,
            );
          });
          return newElement;
        },
        updateField: (field) => {
          set((state) => {
            const fieldToUpdate = state.model.fields.find(
              (q) => q.id === field.id,
            );
            if (!fieldToUpdate) return;

            const fieldIndex = state.model.fields.findIndex(
              (q) => q.id === field.id,
            );

            const newField: FieldSchema = {
              ...fieldToUpdate,
              ...field,
              properties: omitBy(
                {
                  ...fieldToUpdate.properties,
                  ...field.properties,
                },
                (v) => v === null,
              ),
              validations: omitBy(
                {
                  ...fieldToUpdate.validations,
                  ...field.validations,
                },
                (v) => v === null,
              ),
            };

            state.model.fields.splice(fieldIndex, 1, newField);
          });
        },
        insertQuestionChoice: ({fieldId: elementId}) => {
          set((state) => {
            const Choices = state.model.fields.find((q) => q.id === elementId)
              ?.properties.choices;

            if (!Choices) return;

            Choices.push({
              id: uuidv4(),
              value: '',
            });
          });
        },
        updateQuestionChoice: ({fieldId: elementId, newChoice}) => {
          set((state) => {
            const fieldToUpdate = state.model.fields.find(
              (q) => q.id === elementId,
            );
            if (!fieldToUpdate) return;

            const fieldIndex = state.model.fields.findIndex(
              (q) => q.id === elementId,
            );

            const newField: FieldSchema = {
              ...fieldToUpdate,
              properties: {
                ...fieldToUpdate.properties,
                choices: fieldToUpdate.properties.choices?.map((choice) =>
                  choice.id === newChoice.id ? newChoice : choice,
                ),
              },
            };

            state.model.fields.splice(fieldIndex, 1, newField);
          });
        },
        moveChoices: ({fieldId: elementId, newChoices}) => {
          set((state) => {
            const element = state.model.fields.find((q) => q.id === elementId);

            if (!element?.properties.choices) return;

            element.properties.choices = newChoices;
          });
        },
        deleteQuestionChoice: ({fieldId: elementId, choiceId}) => {
          set((state) => {
            const Choices = state.model.fields.find((q) => q.id === elementId)
              ?.properties.choices;

            if (!Choices || Choices.length === 1) return;

            const indexOfChoiceToDelete = Choices.findIndex(
              (c) => c.id === choiceId,
            );

            if (indexOfChoiceToDelete === -1) return;

            Choices.splice(indexOfChoiceToDelete, 1);
          });
        },
        deleteChoices: ({fieldId: elementId}) => {
          set((state) => {
            const element = state.model.fields.find((q) => q.id === elementId);
            if (!element) return;

            element.properties.choices = [
              {
                id: uuidv4(),
                value: '',
              },
            ];
          });
        },
        duplicateQuestionChoice: ({fieldId: elementId, choiceId}) => {
          set((state) => {
            const Choices = state.model.fields.find((q) => q.id === elementId)
              ?.properties.choices;

            if (!Choices) return;

            const indexOfChoiceToDuplicate = Choices.findIndex(
              (c) => c.id === choiceId,
            );

            if (indexOfChoiceToDuplicate === -1) return;

            const choice = Choices[indexOfChoiceToDuplicate];

            const newChoice = {
              value: !!choice.value ? `${choice.value} (copy)` : '',
              id: uuidv4(),
            };

            Choices.splice(indexOfChoiceToDuplicate + 1, 0, newChoice);
          });
        },
        changeFieldType: ({id, type}) => {
          set((state) => {
            const fieldIndex = state.model.fields.findIndex((q) => q.id === id);
            const field = state.model.fields[fieldIndex];
            const newField = buildNewFieldHelper(type, field);

            state.model.fields.splice(fieldIndex, 1, newField);
          });
        },
        setFields: (questions) => {
          set((state) => {
            if (typeof questions === 'function') {
              state.model.fields = questions(state.model.fields);
              return;
            }

            state.model.fields = questions;
          });
        },
        setSchema: (model) => {
          set((state) => {
            state.model = model;
          });
        },
        setSavedSchema: (model) => {
          set((state) => {
            state.savedSchema = model;
          });
        },
        setPublished: (isPublished) => {
          set((state) => {
            state.isPublished = isPublished;
          });
        },
        updateScreen: ({id, key}, options) => {
          set((state) => {
            state.model.screens[key] = state.model.screens[key].map((s) =>
              s.id === id ? {...s, ...options} : s,
            );
          });
        },
        insertScreen: (key) => {
          const screen =
            key === 'welcome' ? 'welcome_screen' : 'thank_you_screen';
          let newScreen = buildNewScreenHelper(screen);
          set((state) => {
            state.model.screens[key].push(newScreen);
          });
          return newScreen;
        },
        removeScreen: ({key, id}) => {
          set((state) => {
            state.model.screens[key] = state.model.screens[key].filter(
              (s) => s.id !== id,
            );
          });
        },
      },
    })),
  );
};

export const useSurveyModel = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.model);
};

export const useSurveyFields = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.model.fields);
};

export const useSurveyPublished = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.isPublished);
};

export const useSurveyScreens = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.model.screens);
};

export const useSurveyId = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.id);
};

export const useIsSurveyChanged = () => {
  const store = useDesignerContext();
  const {model, savedSchema} = useStore(store, (state) => ({
    model: state.model,
    savedSchema: state.savedSchema,
  }));

  return !isEqual(model, savedSchema);
};

export const useSurveyStoreActions = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.actions);
};

const [SurveyDesignerStoreProvider, useDesignerContext] =
  createContext<StoreApi<SurveyDesignerStoreState>>();

export {SurveyDesignerStoreProvider};
