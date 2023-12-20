import {isEqual, omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {useShallow} from 'zustand/react/shallow';
import {buildNewQuestionHelper} from '@/lib/utils';
import {QuestionConfig} from '@/lib/validations/question';
import {SurveySchema} from '@/lib/validations/survey';

type SurveySchemaStoreProps = {
  schema: SurveySchema;
  savedSchema: SurveySchema;
};

type SurveySchemaStoreActions = {
  updateTitle: (title: string) => void;
  insertQuestion: (question: QuestionConfig, index?: number) => void;
  deleteQuestion: (question: Pick<QuestionConfig, 'id'>) => void;
  duplicateQuestion: (question: Pick<QuestionConfig, 'id' | 'ref'>) => void;
  changeQuestionType: (question: Pick<QuestionConfig, 'id' | 'type'>) => void;
  updateQuestion: (question: Partial<QuestionConfig> & {id: string}) => void;
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
  duplicateQuestionChoice: (params: {
    questionId: string;
    choiceId: string;
  }) => void;
  insertQuestionChoice: (params: {questionId: string}) => void;
  setQuestions: (questions: QuestionConfig[]) => void;
  setSchema: (schema: SurveySchema) => void;
  setSavedSchema: (schema: SurveySchema) => void;
};

export type SurveySchemaStoreState = SurveySchemaStoreProps & {
  actions: SurveySchemaStoreActions;
};

export const useSurveySchemaStore = create<SurveySchemaStoreState>()(
  immer((set) => ({
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

          const newField: QuestionConfig = {
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

          const newField: QuestionConfig = {
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

          if (!questionChoices) return;

          const indexOfChoiceToDelete = questionChoices.findIndex(
            (c) => c.id === choiceId,
          );

          if (indexOfChoiceToDelete === -1) return;

          questionChoices.splice(indexOfChoiceToDelete, 1);
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
    },
  })),
);

export const useSurveyDetails = () =>
  useSurveySchemaStore(
    useShallow(({schema}) => ({
      id: schema.id,
      title: schema.title,
    })),
  );
export const useSurveyDetailsActions = () =>
  useSurveySchemaStore((state) => {
    const {updateTitle} = state.actions;
    return {updateTitle};
  });

export const useSurveyQuestions = () =>
  useSurveySchemaStore((state) => state.schema.questions);

export const useSurveyQuestionsActions = () =>
  useSurveySchemaStore((state) => {
    const {
      updateQuestionChoice,
      insertQuestion,
      deleteQuestion,
      duplicateQuestion,
      changeQuestionType,
      updateQuestion,
      setQuestions,
    } = state.actions;

    return {
      updateQuestionChoice,
      insertQuestion,
      deleteQuestion,
      duplicateQuestion,
      changeQuestionType,
      updateQuestion,
      setQuestions,
    };
  });

export const {
  updateQuestionChoice,
  insertQuestion,
  insertQuestionChoice,
  deleteQuestion,
  duplicateQuestion,
  duplicateQuestionChoice,
  changeQuestionType,
  updateQuestion,
  setQuestions,
  deleteQuestionChoice,
  setSavedSchema,
  setSchema,
  updateTitle,
} = useSurveySchemaStore.getState().actions;

export const useSurveySchema = () =>
  useSurveySchemaStore((state) => state.schema);
export const useSurveySchemaActions = () =>
  useSurveySchemaStore((state) => ({
    setSchema: state.actions.setSchema,
    setSavedSchema: state.actions.setSavedSchema,
  }));

export const useIsSurveyChanged = () => {
  const {isChanged} = useSurveySchemaStore(
    useShallow(({schema, savedSchema}) => ({
      isChanged: !isEqual(schema, savedSchema),
    })),
  );

  return isChanged;
};
