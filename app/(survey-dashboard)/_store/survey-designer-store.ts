import {isEqual, merge, omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {createStore, StoreApi, useStore} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {createContext} from '@/lib/context';
import {buildNewElementHelper} from '@/lib/utils';
import {
  ElementSchema,
  SurveyResponse,
  SurveySchema,
} from '@/lib/validations/survey';

type SurveyDesignerStoreProps = {
  id: string;
  schema: SurveySchema;
  savedSchema: SurveySchema;
  isPublished: boolean;
};

type ElementStoreActions = {
  insertElement: (element: ElementSchema, index?: number) => void;
  deleteElement: (element: Pick<ElementSchema, 'id'>) => void;
  duplicateElement: (element: Pick<ElementSchema, 'id' | 'ref'>) => void;
  changeElementType: (element: Pick<ElementSchema, 'id' | 'type'>) => void;
  updateElement: (element: Partial<ElementSchema> & {id: string}) => void;
  setElements: (
    elements:
      | ElementSchema[]
      | ((fn: SurveySchema['elements']) => SurveySchema['elements']),
  ) => void;
};

type QuestionChoiceStoreActions = {
  updateQuestionChoice: (params: {
    elementId: string;
    newChoice: {
      id: string;
      value: string;
    };
  }) => void;
  moveChoices: (params: {
    elementId: string;
    newChoices: NonNullable<ElementSchema['properties']['choices']>;
  }) => void;
  deleteQuestionChoice: (params: {elementId: string; choiceId: string}) => void;
  deleteChoices: (params: {elementId: string}) => void;
  duplicateQuestionChoice: (params: {
    elementId: string;
    choiceId: string;
  }) => void;
  insertQuestionChoice: (params: {elementId: string}) => void;
};

type SurveySchemaStoreActions = {
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  setSchema: (schema: SurveySchema) => void;
  setSavedSchema: (schema: SurveySchema) => void;
  setPublished: (isPublished: boolean) => void;
};

type SurveyScreenStoreActions = {
  updateScreen: (screen: 'welcome' | 'thank_you', message: string) => void;
};

type SurveyDesignerStoreActions = SurveySchemaStoreActions &
  ElementStoreActions &
  QuestionChoiceStoreActions &
  SurveyScreenStoreActions;

export type SurveyDesignerStoreState = SurveyDesignerStoreProps & {
  actions: SurveyDesignerStoreActions;
};

export const createSurveyDesignerStore = (
  initProps?: Partial<SurveyResponse['survey']>,
) => {
  const schema = merge(
    {
      title: '',
      elements: [],
      version: 1,
      screens: {
        thank_you: {
          message: '',
        },
        welcome: {
          message: '',
        },
      },
    },
    initProps?.schema,
  );

  const initialState: SurveyDesignerStoreProps = {
    id: initProps?.id ?? uuidv4(),
    isPublished: initProps?.is_published ?? false,
    schema,
    savedSchema: schema,
  };

  return createStore<SurveyDesignerStoreState>()(
    immer((set) => ({
      ...initialState,
      actions: {
        updateTitle: (title) => {
          set((state) => {
            state.schema.title = title;
          });
        },
        updateDescription: (description) => {
          set((state) => {
            state.schema.description = description;
          });
        },
        insertElement: ({type, ref}, insertAtIndex) => {
          const newField = buildNewElementHelper(type, {
            ref: ref ?? uuidv4(),
            type,
          });

          set((state) => {
            if (insertAtIndex !== undefined) {
              state.schema.elements.splice(insertAtIndex, 0, newField);
              return;
            }

            state.schema.elements.push(newField);
          });
        },
        deleteElement: ({id}) => {
          set((state) => {
            const elements = state.schema.elements || [];

            const indexOfFieldToDelete = elements.findIndex((q) => q.id === id);
            if (indexOfFieldToDelete === -1) return;

            state.schema.elements.splice(indexOfFieldToDelete, 1);
          });
        },
        duplicateElement: ({id, ref}) => {
          set((state) => {
            const element = state.schema.elements.find((q) => q.id === id);
            if (!element) return state;

            const newElement = buildNewElementHelper(element.type, {
              ...element,
              ref,
              id: uuidv4(),
              text: element.text ? `${element.text} (copy)` : '',
            });

            const indexOfFieldToDuplicate = state.schema.elements.findIndex(
              (q) => q.id === id,
            );
            state.schema.elements.splice(
              indexOfFieldToDuplicate + 1,
              0,
              newElement,
            );
          });
        },
        updateElement: (field) => {
          set((state) => {
            const fieldToUpdate = state.schema.elements.find(
              (q) => q.id === field.id,
            );
            if (!fieldToUpdate) return;

            const fieldIndex = state.schema.elements.findIndex(
              (q) => q.id === field.id,
            );

            const newField: ElementSchema = {
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

            state.schema.elements.splice(fieldIndex, 1, newField);
          });
        },
        insertQuestionChoice: ({elementId}) => {
          set((state) => {
            const Choices = state.schema.elements.find(
              (q) => q.id === elementId,
            )?.properties.choices;

            if (!Choices) return;

            Choices.push({
              id: uuidv4(),
              value: '',
            });
          });
        },
        updateQuestionChoice: ({elementId: elementId, newChoice}) => {
          set((state) => {
            const fieldToUpdate = state.schema.elements.find(
              (q) => q.id === elementId,
            );
            if (!fieldToUpdate) return;

            const fieldIndex = state.schema.elements.findIndex(
              (q) => q.id === elementId,
            );

            const newField: ElementSchema = {
              ...fieldToUpdate,
              properties: {
                ...fieldToUpdate.properties,
                choices: fieldToUpdate.properties.choices?.map((choice) =>
                  choice.id === newChoice.id ? newChoice : choice,
                ),
              },
            };

            state.schema.elements.splice(fieldIndex, 1, newField);
          });
        },
        moveChoices: ({elementId: elementId, newChoices}) => {
          set((state) => {
            const element = state.schema.elements.find(
              (q) => q.id === elementId,
            );

            if (!element?.properties.choices) return;

            element.properties.choices = newChoices;
          });
        },
        deleteQuestionChoice: ({elementId: elementId, choiceId}) => {
          set((state) => {
            const Choices = state.schema.elements.find(
              (q) => q.id === elementId,
            )?.properties.choices;

            if (!Choices || Choices.length === 1) return;

            const indexOfChoiceToDelete = Choices.findIndex(
              (c) => c.id === choiceId,
            );

            if (indexOfChoiceToDelete === -1) return;

            Choices.splice(indexOfChoiceToDelete, 1);
          });
        },
        deleteChoices: ({elementId: elementId}) => {
          set((state) => {
            const element = state.schema.elements.find(
              (q) => q.id === elementId,
            );
            if (!element) return;

            element.properties.choices = [
              {
                id: uuidv4(),
                value: '',
              },
            ];
          });
        },
        duplicateQuestionChoice: ({elementId: elementId, choiceId}) => {
          set((state) => {
            const Choices = state.schema.elements.find(
              (q) => q.id === elementId,
            )?.properties.choices;

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
        changeElementType: ({id, type}) => {
          set((state) => {
            const fieldIndex = state.schema.elements.findIndex(
              (q) => q.id === id,
            );
            const field = state.schema.elements[fieldIndex];
            const newField = buildNewElementHelper(type, field);

            state.schema.elements.splice(fieldIndex, 1, newField);
          });
        },
        setElements: (questions) => {
          set((state) => {
            if (typeof questions === 'function') {
              state.schema.elements = questions(state.schema.elements);
              return;
            }

            state.schema.elements = questions;
          });
        },
        setSchema: (schema) => {
          set((state) => {
            state.schema = schema;
          });
        },
        setSavedSchema: (schema) => {
          set((state) => {
            state.savedSchema = schema;
          });
        },
        setPublished: (isPublished) => {
          set((state) => {
            state.isPublished = isPublished;
          });
        },
        updateScreen: (screen, message) => {
          set((state) => {
            state.schema.screens[screen].message = message;
          });
        },
      },
    })),
  );
};

export const useSurveySchema = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.schema);
};

export const useSurveyElements = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.schema.elements);
};

export const useSurveyPublished = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.isPublished);
};

export const useSurveyScreens = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.schema.screens);
};

export const useSurveyId = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.id);
};

export const useIsSurveyChanged = () => {
  const store = useDesignerContext();
  const {schema, savedSchema} = useStore(store, (state) => ({
    schema: state.schema,
    savedSchema: state.savedSchema,
  }));

  return !isEqual(schema, savedSchema);
};

export const useDesignerActions = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.actions);
};

const [SurveyDesignerStoreProvider, useDesignerContext] =
  createContext<StoreApi<SurveyDesignerStoreState>>();

export {SurveyDesignerStoreProvider};
