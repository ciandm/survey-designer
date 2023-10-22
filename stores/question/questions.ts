import {Question} from '@prisma/client';
import {create} from 'zustand';

interface State {
  questions: {
    [id: string]: Question;
  };
  actions: {
    setQuestions: (questions: Question[]) => void;
    updateQuestion: (question: Question) => void;
  };
}

const useQuestionsStore = create<State>()((set) => ({
  questions: {},
  actions: {
    setQuestions: (questions) =>
      set({questions: questions.reduce((acc, q) => ({...acc, [q.id]: q}), {})}),
    updateQuestion: (question) =>
      set((state) => ({
        questions: {
          ...state.questions,
          [question.id]: {
            ...(state.questions[question.id] || {}),
            ...question,
          },
        },
      })),
  },
}));

export const useQuestions = () => useQuestionsStore((state) => state.questions);
export const useQuestion = (id: string) =>
  useQuestionsStore((state) => state.questions[id]);
export const useSetQuestions = () =>
  useQuestionsStore((state) => state.actions.setQuestions);
