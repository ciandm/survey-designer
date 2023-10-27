import {z} from 'zod';
import {create} from 'zustand';
import {questionDesignSchema} from '@/lib/validations/question';

type Question = z.infer<typeof questionDesignSchema> & {id: string};

interface State {
  survey: {
    title: string;
    description?: string;
  };
  questions: Question[];
  selectedQuestionId: string;
  actions: Actions;
}

interface Actions {
  setSurveyQuestions: (questions: Question[]) => void;
  updateQuestion: (question: Partial<Question> & {id: string}) => void;
  setSelectedQuestionId: (id: string) => void;
}

const useSurveySchemaStore = create<State>()((set) => ({
  survey: {
    title: '',
    description: '',
  },
  questions: [],
  selectedQuestionId: '',
  actions: {
    setSurveyQuestions: (questions) =>
      set({
        questions,
      }),
    updateQuestion: (question) =>
      set((state) => ({
        questions: state.questions.map((q) =>
          q.id === question.id ? {...q, ...question} : q,
        ),
      })),
    setSelectedQuestionId: (id) => set({selectedQuestionId: id}),
  },
}));

export const useSurveyFormQuestions = () =>
  useSurveySchemaStore((state) => state.questions);
export const useSurveyFormSelectedQuestionId = () =>
  useSurveySchemaStore((state) => state.selectedQuestionId);
export const {setSurveyQuestions, setSelectedQuestionId, updateQuestion} =
  useSurveySchemaStore.getState().actions;
