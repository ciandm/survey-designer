import {createContext, useContext} from 'react';
import {omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {create, createStore, StoreApi, useStore} from 'zustand';
import {buildFieldHelper} from '@/lib/utils';
import {QuestionConfig} from '@/lib/validations/question';

type SurveySchemaProps = {
  title: string;
  description?: string;
  questions: QuestionConfig[];
  activeQuestionRef?: string;
};

type SurveySchemaActions = {
  insertQuestion: (question: Pick<QuestionConfig, 'type'>) => void;
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  deleteQuestion: (question: Pick<QuestionConfig, 'id'>) => void;
  duplicateQuestion: (question: Pick<QuestionConfig, 'id'>) => void;
  changeQuestionType: (question: Pick<QuestionConfig, 'id' | 'type'>) => void;
  setActiveQuestionRef: (ref: string) => void;
  updateQuestion: (question: Partial<QuestionConfig> & {id: string}) => void;
};

export type SurveySchemaState = SurveySchemaProps & {
  actions: SurveySchemaActions;
};

export const useSurveyStore = create<SurveySchemaState>()((set, get) => ({
  title: '',
  description: '',
  questions: [],
  activeQuestionRef: '',
  actions: {
    insertQuestion: ({type}) => {
      const newRef = uuidv4();
      const newField = buildFieldHelper(type, {
        type,
        ref: newRef,
      });

      set((state) => ({
        ...state,
        questions: [...state.questions, newField],
        activeQuestionRef: newRef,
      }));
    },
    updateTitle: (title) => {
      set((state) => ({
        ...state,
        title,
      }));
    },
    updateDescription: (description) => {
      set((state) => ({
        ...state,
        description,
      }));
    },
    setActiveQuestionRef: (ref) => {
      set((state) => ({
        ...state,
        activeQuestionRef: ref,
      }));
    },
    deleteQuestion: ({id}) => {
      const questions = get().questions || [];
      if (questions.length === 1) return;

      const indexOfFieldToDelete = questions.findIndex((q) => q.id === id);

      let fieldIdToMakeActive =
        questions[indexOfFieldToDelete - 1]?.ref ||
        questions[indexOfFieldToDelete + 1]?.ref ||
        '';

      set((state) => ({
        questions: state.questions.filter((q) => q.id !== id),
        activeQuestionRef: fieldIdToMakeActive,
      }));
    },
    duplicateQuestion: ({id}) => {
      const newRef = uuidv4();

      set((state) => {
        const question = state.questions.find((q) => q.id === id);
        if (!question) return state;

        const newQuestion = {
          ...question,
          text: question.text ? `${question.text} (copy)` : '',
          ref: newRef,
          id: uuidv4(),
        };
        const questions = [...state.questions];
        questions.splice(
          state.questions.findIndex((q) => q.id === id) + 1,
          0,
          newQuestion,
        );
        return {
          questions,
          activeQuestionRef: newRef,
        };
      });
    },
    updateQuestion: (field) => {
      const fieldToUpdate = get().questions.find((q) => q.id === field.id);
      if (!fieldToUpdate) return;

      const fieldIndex = get().questions.findIndex((q) => q.id === field.id);

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

      set((state) => {
        const questions = [...state.questions];
        questions.splice(fieldIndex, 1, newField);
        return {
          questions,
        };
      });
    },
    changeQuestionType: ({id, type}) => {
      set((state) => {
        const fieldIndex = state.questions.findIndex((q) => q.id === id);
        const field = state.questions[fieldIndex];
        const newField = buildFieldHelper(type, field);
        const questions = [...state.questions];
        questions.splice(fieldIndex, 1, newField);
        return {
          questions,
        };
      });
    },
  },
}));

export const useSurveyTitle = () => useSurveyStore((state) => state.title);
export const useSurveyDescription = () =>
  useSurveyStore((state) => state.description);
export const useSurveyQuestions = () =>
  useSurveyStore((state) => state.questions);
export const useSurveyFieldActions = () =>
  useSurveyStore((state) => state.actions);
export const useActiveQuestionRef = () =>
  useSurveyStore((state) => state.activeQuestionRef);
export const useActiveQuestion = () => {
  const activeQuestionRef = useActiveQuestionRef();
  const questions = useSurveyQuestions();
  const question = questions.find((q) => q.ref === activeQuestionRef);
  const index = questions.findIndex((q) => q.ref === activeQuestionRef);

  return {activeQuestion: question, activeQuestionIndex: index};
};
