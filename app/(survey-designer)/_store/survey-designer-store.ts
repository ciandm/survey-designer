import {isEqual, merge, omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {createStore, StoreApi, useStore} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {ElementSchemaType} from '@/types/element';
import {ParsedModelType, SurveyWithParsedModelType} from '@/types/survey';
import {createContext} from '@/utils/context';
import {buildNewElementHelper} from '@/utils/survey';

type SurveyDesignerStoreProps = {
  id: string;
  model: ParsedModelType;
  savedSchema: ParsedModelType;
  isPublished: boolean;
};

type ElementStoreActions = {
  insertElement: (
    element: Partial<ElementSchemaType>,
    index?: number,
  ) => string;
  deleteElement: (
    element: Pick<ElementSchemaType, 'id'>,
  ) => ElementSchemaType[];
  duplicateElement: (element: Pick<ElementSchemaType, 'id'>) => string;
  changeElementType: (element: Pick<ElementSchemaType, 'id' | 'type'>) => void;
  updateElement: (element: Partial<ElementSchemaType> & {id: string}) => void;
  setElements: (
    elements:
      | ElementSchemaType[]
      | ((fn: ParsedModelType['elements']) => ParsedModelType['elements']),
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
    newChoices: NonNullable<ElementSchemaType['properties']['choices']>;
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
  setSchema: (model: ParsedModelType) => void;
  setSavedSchema: (model: ParsedModelType) => void;
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
  initProps: Partial<SurveyWithParsedModelType> = {},
) => {
  const model = merge(
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
        insertElement: (field, insertAtIndex) => {
          const newField = buildNewElementHelper(field.type ?? 'short_text', {
            ...field,
          });

          set((state) => {
            if (insertAtIndex !== undefined) {
              state.model.elements.splice(insertAtIndex, 0, newField);
              return;
            }

            state.model.elements.push(newField);
          });

          return newField.id;
        },
        deleteElement: ({id}) => {
          let elements = get().model.elements;
          set((state) => {
            elements = elements.filter((q) => q.id !== id);

            state.model.elements = elements;
          });

          return elements;
        },
        duplicateElement: ({id}) => {
          const newId = uuidv4();
          set((state) => {
            const element = state.model.elements.find((q) => q.id === id);
            if (!element) return state;

            const newElement = buildNewElementHelper(element.type, {
              ...element,
              id: newId,
              text: element.text ? `${element.text} (copy)` : '',
            });

            const indexOfFieldToDuplicate = state.model.elements.findIndex(
              (q) => q.id === id,
            );
            state.model.elements.splice(
              indexOfFieldToDuplicate + 1,
              0,
              newElement,
            );
          });
          return newId;
        },
        updateElement: (field) => {
          set((state) => {
            const fieldToUpdate = state.model.elements.find(
              (q) => q.id === field.id,
            );
            if (!fieldToUpdate) return;

            const fieldIndex = state.model.elements.findIndex(
              (q) => q.id === field.id,
            );

            const newField: ElementSchemaType = {
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

            state.model.elements.splice(fieldIndex, 1, newField);
          });
        },
        insertQuestionChoice: ({elementId}) => {
          set((state) => {
            const Choices = state.model.elements.find((q) => q.id === elementId)
              ?.properties.choices;

            if (!Choices) return;

            Choices.push({
              id: uuidv4(),
              value: '',
            });
          });
        },
        updateQuestionChoice: ({elementId: elementId, newChoice}) => {
          set((state) => {
            const fieldToUpdate = state.model.elements.find(
              (q) => q.id === elementId,
            );
            if (!fieldToUpdate) return;

            const fieldIndex = state.model.elements.findIndex(
              (q) => q.id === elementId,
            );

            const newField: ElementSchemaType = {
              ...fieldToUpdate,
              properties: {
                ...fieldToUpdate.properties,
                choices: fieldToUpdate.properties.choices?.map((choice) =>
                  choice.id === newChoice.id ? newChoice : choice,
                ),
              },
            };

            state.model.elements.splice(fieldIndex, 1, newField);
          });
        },
        moveChoices: ({elementId: elementId, newChoices}) => {
          set((state) => {
            const element = state.model.elements.find(
              (q) => q.id === elementId,
            );

            if (!element?.properties.choices) return;

            element.properties.choices = newChoices;
          });
        },
        deleteQuestionChoice: ({elementId: elementId, choiceId}) => {
          set((state) => {
            const Choices = state.model.elements.find((q) => q.id === elementId)
              ?.properties.choices;

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
            const element = state.model.elements.find(
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
            const Choices = state.model.elements.find((q) => q.id === elementId)
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
        changeElementType: ({id, type}) => {
          set((state) => {
            const fieldIndex = state.model.elements.findIndex(
              (q) => q.id === id,
            );
            const field = state.model.elements[fieldIndex];
            const newField = buildNewElementHelper(type, field);

            state.model.elements.splice(fieldIndex, 1, newField);
          });
        },
        setElements: (questions) => {
          set((state) => {
            if (typeof questions === 'function') {
              state.model.elements = questions(state.model.elements);
              return;
            }

            state.model.elements = questions;
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
        updateScreen: (screen, message) => {
          set((state) => {
            state.model.screens[screen].message = message;
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

export const useSurveyElements = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.model.elements);
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

export const useDesignerActions = () => {
  const store = useDesignerContext();
  return useStore(store, (state) => state.actions);
};

const [SurveyDesignerStoreProvider, useDesignerContext] =
  createContext<StoreApi<SurveyDesignerStoreState>>();

export {SurveyDesignerStoreProvider};
