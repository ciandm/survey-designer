import {omitBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {create} from 'zustand';
import {buildFieldHelper} from '@/lib/utils';
import {QuestionConfig} from '@/lib/validations/question';

type SurveyDesignerProps = {
  id: string;
  title: string;
  description?: string;
  mode: 'edit' | 'preview';
  questions: QuestionConfig[];
  activeQuestionRef?: string;
};

type SurveyDesignerActions = {
  insertQuestion: (question: Pick<QuestionConfig, 'type'>) => void;
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
  deleteQuestion: (question: Pick<QuestionConfig, 'id'>) => void;
  duplicateQuestion: (question: Pick<QuestionConfig, 'id'>) => void;
  changeQuestionType: (question: Pick<QuestionConfig, 'id' | 'type'>) => void;
  setActiveQuestionRef: (ref: string) => void;
  updateQuestion: (question: Partial<QuestionConfig> & {id: string}) => void;
  updateMode: (mode: SurveyDesignerProps['mode']) => void;
};

export type SurveyDesignerState = SurveyDesignerProps & {
  actions: SurveyDesignerActions;
};

export const useSurveyDesignerStore = create<SurveyDesignerState>()(
  (set, get) => ({
    id: '',
    title: '',
    description: '',
    questions: [],
    mode: 'edit',
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
      updateMode: (mode) => {
        set(() => ({
          mode,
        }));
      },
    },
  }),
);

export const useSurveyTitle = () =>
  useSurveyDesignerStore((state) => state.title);
export const useSurveyDescription = () =>
  useSurveyDesignerStore((state) => state.description);
export const useSurveyQuestions = () =>
  useSurveyDesignerStore((state) => state.questions);
export const useSurveyDesignerActions = () =>
  useSurveyDesignerStore((state) => state.actions);
export const useSurveyDesignerMode = () =>
  useSurveyDesignerStore((state) => state.mode);
