import {omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {useShallow} from 'zustand/react/shallow';
import {buildNewQuestionHelper} from '@/lib/utils/question';
import {QuestionConfig} from '@/lib/validations/question';
import {SurveySchema} from '@/lib/validations/survey';

type SurveySchemaStoreProps = {
  schema: SurveySchema;
};

type SurveySchemaStoreActions = {
  updateTitle: (title: string) => void;
  insertQuestion: (question: QuestionConfig) => void;
  deleteQuestion: (question: Pick<QuestionConfig, 'id'>) => void;
  duplicateQuestion: (question: Pick<QuestionConfig, 'id'>) => void;
  changeQuestionType: (question: Pick<QuestionConfig, 'id' | 'type'>) => void;
  updateQuestion: (question: Partial<QuestionConfig> & {id: string}) => void;
  setQuestions: (questions: QuestionConfig[]) => void;
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
    actions: {
      updateTitle: (title) => {
        set((state) => {
          state.schema.title = title;
        });
      },
      insertQuestion: ({type}) => {
        const newField = buildNewQuestionHelper(type, {
          type,
        });

        set((state) => {
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
      duplicateQuestion: ({id}) => {
        const newRef = uuidv4();

        set((state) => {
          const question = state.schema.questions.find((q) => q.id === id);
          if (!question) return state;

          const newQuestion = buildNewQuestionHelper(question.type, {
            ...question,
            text: question.text ? `${question.text} (copy)` : '',
            ref: newRef,
            id: uuidv4(),
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
      insertQuestion,
      deleteQuestion,
      duplicateQuestion,
      changeQuestionType,
      updateQuestion,
      setQuestions,
    } = state.actions;

    return {
      insertQuestion,
      deleteQuestion,
      duplicateQuestion,
      changeQuestionType,
      updateQuestion,
      setQuestions,
    };
  });
