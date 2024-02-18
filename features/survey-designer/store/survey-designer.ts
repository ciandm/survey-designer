import {isEqual, omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {useShallow} from 'zustand/react/shallow';
import {buildNewElementHelper} from '@/lib/utils';
import {ElementSchema, SurveySchema} from '@/lib/validations/survey';

type SurveyDesignerStoreProps = {
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
  moveQuestionChoices: (params: {
    elementId: string;
    newChoices: NonNullable<ElementSchema['properties']['choices']>;
  }) => void;
  deleteQuestionChoice: (params: {elementId: string; choiceId: string}) => void;
  deleteQuestionChoices: (params: {elementId: string}) => void;
  duplicateQuestionChoice: (params: {
    elementId: string;
    choiceId: string;
  }) => void;
  insertQuestionChoice: (params: {elementId: string}) => void;
};

type SurveySchemaStoreActions = {
  updateTitle: (title: string) => void;
  setSchema: (schema: SurveySchema) => void;
  setSavedSchema: (schema: SurveySchema) => void;
  setPublished: (isPublished: boolean) => void;
};

type SurveyDesignerStoreActions = SurveySchemaStoreActions &
  ElementStoreActions &
  QuestionChoiceStoreActions;

export type SurveyDesignerStoreState = SurveyDesignerStoreProps & {
  actions: SurveyDesignerStoreActions;
};

const initialSchema: SurveySchema = {
  id: '',
  title: '',
  elements: [],
  version: 1,
};

export const useSurveyDesignerStore = create<SurveyDesignerStoreState>()(
  immer((set) => ({
    isPublished: false,
    schema: initialSchema,
    savedSchema: initialSchema,
    actions: {
      updateTitle: (title) => {
        set((state) => {
          state.schema.title = title;
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
          const questionChoices = state.schema.elements.find(
            (q) => q.id === elementId,
          )?.properties.choices;

          if (!questionChoices) return;

          questionChoices.push({
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
      moveQuestionChoices: ({elementId: elementId, newChoices}) => {
        set((state) => {
          const element = state.schema.elements.find((q) => q.id === elementId);

          if (!element?.properties.choices) return;

          element.properties.choices = newChoices;
        });
      },
      deleteQuestionChoice: ({elementId: elementId, choiceId}) => {
        set((state) => {
          const questionChoices = state.schema.elements.find(
            (q) => q.id === elementId,
          )?.properties.choices;

          if (!questionChoices || questionChoices.length === 1) return;

          const indexOfChoiceToDelete = questionChoices.findIndex(
            (c) => c.id === choiceId,
          );

          if (indexOfChoiceToDelete === -1) return;

          questionChoices.splice(indexOfChoiceToDelete, 1);
        });
      },
      deleteQuestionChoices: ({elementId: elementId}) => {
        set((state) => {
          const element = state.schema.elements.find((q) => q.id === elementId);
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
          const questionChoices = state.schema.elements.find(
            (q) => q.id === elementId,
          )?.properties.choices;

          if (!questionChoices) return;

          const indexOfChoiceToDuplicate = questionChoices.findIndex(
            (c) => c.id === choiceId,
          );

          if (indexOfChoiceToDuplicate === -1) return;

          const choice = questionChoices[indexOfChoiceToDuplicate];

          const newChoice = {
            value: !!choice.value ? `${choice.value} (copy)` : '',
            id: uuidv4(),
          };

          questionChoices.splice(indexOfChoiceToDuplicate + 1, 0, newChoice);
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
    },
  })),
);

export const useSurveyDetails = () =>
  useSurveyDesignerStore(
    useShallow(({schema}) => ({
      id: schema.id,
      title: schema.title,
    })),
  );
export const useSurveyDetailsActions = () =>
  useSurveyDesignerStore((state) => {
    const {updateTitle} = state.actions;
    return {updateTitle};
  });

export const useSurveyElements = () =>
  useSurveyDesignerStore((state) => state.schema.elements);

export const {
  changeElementType,
  deleteElement,
  deleteQuestionChoice,
  deleteQuestionChoices,
  duplicateElement,
  duplicateQuestionChoice,
  insertElement,
  insertQuestionChoice,
  setPublished,
  setElements,
  setSavedSchema,
  setSchema,
  updateElement,
  updateQuestionChoice,
  updateTitle,
  moveQuestionChoices,
} = useSurveyDesignerStore.getState().actions;

export const useSurveySchema = () =>
  useSurveyDesignerStore((state) => state.schema);
export const useSurveySchemaActions = () =>
  useSurveyDesignerStore((state) => ({
    setSchema: state.actions.setSchema,
    setSavedSchema: state.actions.setSavedSchema,
  }));

export const useIsSurveyChanged = () => {
  const {isChanged} = useSurveyDesignerStore(
    useShallow(({schema, savedSchema}) => ({
      isChanged: !isEqual(schema, savedSchema),
    })),
  );

  return isChanged;
};

export const useIsSurveyPublished = () =>
  useSurveyDesignerStore((state) => state.isPublished);
