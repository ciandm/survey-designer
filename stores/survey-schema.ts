import {createContext, useContext} from 'react';
import {omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {createStore, StoreApi, useStore} from 'zustand';
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

export const createSurveySchemaStore = (
  initProps?: Partial<SurveySchemaProps>,
) => {
  const DEFAULT_PROPS: SurveySchemaProps = {
    title: '',
    description: '',
    questions: [],
    activeQuestionRef: '',
  };
  return createStore<SurveySchemaState>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
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
          const field = state.questions.find((q) => q.id === id);
          if (!field) return state;

          const newField = {
            ...field,
            text: field.text ? `${field.text} (copy)` : '',
            ref: newRef,
            id: uuidv4(),
          };
          const questions = [...state.questions];
          questions.splice(
            state.questions.findIndex((q) => q.id === id) + 1,
            0,
            newField,
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
};

export const SurveySchemaStoreContext =
  createContext<StoreApi<SurveySchemaState> | null>(null);

export const useSurveySchemaStore = <T>(
  selector: (state: SurveySchemaState) => T,
) => {
  const store = useContext(SurveySchemaStoreContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }
  return useStore(store, selector);
};
