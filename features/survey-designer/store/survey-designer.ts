import {isEqual, omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {useShallow} from 'zustand/react/shallow';
import {buildNewQuestionHelper} from '@/lib/utils';
import {QuestionSchema} from '@/lib/validations/survey';
import {SurveySchema} from '@/lib/validations/survey';

type SurveyDesignerStoreProps = {
  schema: SurveySchema;
  savedSchema: SurveySchema;
  isPublished: boolean;
};

type SurveyDesignerStoreActions = {
  updateTitle: (title: string) => void;
  insertQuestion: (question: QuestionSchema, index?: number) => void;
  deleteQuestion: (question: Pick<QuestionSchema, 'id'>) => void;
  duplicateQuestion: (question: Pick<QuestionSchema, 'id' | 'ref'>) => void;
  changeQuestionType: (question: Pick<QuestionSchema, 'id' | 'type'>) => void;
  updateQuestion: (question: Partial<QuestionSchema> & {id: string}) => void;
  updateQuestionChoice: (params: {
    questionId: string;
    newChoice: {
      id: string;
      value: string;
    };
  }) => void;
  deleteQuestionChoice: (params: {
    questionId: string;
    choiceId: string;
  }) => void;
  deleteQuestionChoices: (params: {questionId: string}) => void;
  duplicateQuestionChoice: (params: {
    questionId: string;
    choiceId: string;
  }) => void;
  insertQuestionChoice: (params: {questionId: string}) => void;
  setQuestions: (questions: QuestionSchema[]) => void;
  setSchema: (schema: SurveySchema) => void;
  setSavedSchema: (schema: SurveySchema) => void;
  setPublished: (isPublished: boolean) => void;
};

export type SurveyDesignerStoreState = SurveyDesignerStoreProps & {
  actions: SurveyDesignerStoreActions;
};

export const useSurveyDesignerStore = create<SurveyDesignerStoreState>()(
  immer((set) => ({
    isPublished: false,
    schema: {
      id: '',
      title: '',
      questions: [],
    },
    savedSchema: {
      id: '',
      title: '',
      questions: [],
    },
    actions: {
      updateTitle: (title) => {
        set((state) => {
          state.schema.title = title;
        });
      },
      insertQuestion: ({type, ref}, insertAtIndex) => {
        const newField = buildNewQuestionHelper(type, {
          ref: ref ?? uuidv4(),
          type,
        });

        set((state) => {
          if (insertAtIndex !== undefined) {
            state.schema.questions.splice(insertAtIndex, 0, newField);
            return;
          }

          state.schema.questions.push(newField);
        });
      },
      deleteQuestion: ({id}) => {
        set((state) => {
          const questions = state.schema.questions || [];
          if (questions.length === 1) return;

          const indexOfFieldToDelete = questions.findIndex((q) => q.id === id);
          if (indexOfFieldToDelete === -1) return;

          state.schema.questions.splice(indexOfFieldToDelete, 1);
        });
      },
      duplicateQuestion: ({id, ref}) => {
        set((state) => {
          const question = state.schema.questions.find((q) => q.id === id);
          if (!question) return state;

          const newQuestion = buildNewQuestionHelper(question.type, {
            ...question,
            ref,
            id: uuidv4(),
            text: question.text ? `${question.text} (copy)` : '',
          });

          const indexOfFieldToDuplicate = state.schema.questions.findIndex(
            (q) => q.id === id,
          );
          state.schema.questions.splice(
            indexOfFieldToDuplicate + 1,
            0,
            newQuestion,
          );
        });
      },
      updateQuestion: (field) => {
        set((state) => {
          const fieldToUpdate = state.schema.questions.find(
            (q) => q.id === field.id,
          );
          if (!fieldToUpdate) return;

          const fieldIndex = state.schema.questions.findIndex(
            (q) => q.id === field.id,
          );

          const newField: QuestionSchema = {
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

          state.schema.questions.splice(fieldIndex, 1, newField);
        });
      },
      insertQuestionChoice: ({questionId}) => {
        set((state) => {
          const questionChoices = state.schema.questions.find(
            (q) => q.id === questionId,
          )?.properties.choices;

          if (!questionChoices) return;

          questionChoices.push({
            id: uuidv4(),
            value: '',
          });
        });
      },
      updateQuestionChoice: ({questionId, newChoice}) => {
        set((state) => {
          const fieldToUpdate = state.schema.questions.find(
            (q) => q.id === questionId,
          );
          if (!fieldToUpdate) return;

          const fieldIndex = state.schema.questions.findIndex(
            (q) => q.id === questionId,
          );

          const newField: QuestionSchema = {
            ...fieldToUpdate,
            properties: {
              ...fieldToUpdate.properties,
              choices: fieldToUpdate.properties.choices?.map((choice) =>
                choice.id === newChoice.id ? newChoice : choice,
              ),
            },
          };

          state.schema.questions.splice(fieldIndex, 1, newField);
        });
      },
      deleteQuestionChoice: ({questionId, choiceId}) => {
        set((state) => {
          const questionChoices = state.schema.questions.find(
            (q) => q.id === questionId,
          )?.properties.choices;

          if (!questionChoices || questionChoices.length === 1) return;

          const indexOfChoiceToDelete = questionChoices.findIndex(
            (c) => c.id === choiceId,
          );

          if (indexOfChoiceToDelete === -1) return;

          questionChoices.splice(indexOfChoiceToDelete, 1);
        });
      },
      deleteQuestionChoices: ({questionId}) => {
        set((state) => {
          const question = state.schema.questions.find(
            (q) => q.id === questionId,
          );
          if (!question) return;

          question.properties.choices = [
            {
              id: uuidv4(),
              value: '',
            },
          ];
        });
      },
      duplicateQuestionChoice: ({questionId, choiceId}) => {
        set((state) => {
          const questionChoices = state.schema.questions.find(
            (q) => q.id === questionId,
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
      changeQuestionType: ({id, type}) => {
        set((state) => {
          const fieldIndex = state.schema.questions.findIndex(
            (q) => q.id === id,
          );
          const field = state.schema.questions[fieldIndex];
          const newField = buildNewQuestionHelper(type, field);

          state.schema.questions.splice(fieldIndex, 1, newField);
        });
      },
      setQuestions: (questions) => {
        set((state) => (state.schema.questions = questions));
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

export const useSurveyQuestions = () =>
  useSurveyDesignerStore((state) => state.schema.questions);

export const {
  changeQuestionType,
  deleteQuestion,
  deleteQuestionChoice,
  deleteQuestionChoices,
  duplicateQuestion,
  duplicateQuestionChoice,
  insertQuestion,
  insertQuestionChoice,
  setPublished,
  setQuestions,
  setSavedSchema,
  setSchema,
  updateQuestion,
  updateQuestionChoice,
  updateTitle,
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
