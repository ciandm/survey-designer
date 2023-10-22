import {Prisma, Question} from '@prisma/client';
import {create} from 'zustand';

interface State {
  questions: {
    [id: string]: Prisma.QuestionGetPayload<{include: {answers: true}}>;
  };
  selectedQuestionId: string;
  actions: {
    setQuestions: (questions: Question[]) => void;
    updateQuestion: (question: Partial<Question> & {id: string}) => void;
    setSelectedQuestionId: (id: string) => void;
  };
}

const useQuestionsStore = create<State>()((set) => ({
  questions: {},
  selectedQuestionId: '',
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
    setSelectedQuestionId: (id) => set({selectedQuestionId: id}),
  },
}));

export const useQuestions = () => useQuestionsStore((state) => state.questions);
export const useQuestion = (id: string) =>
  useQuestionsStore((state) => state.questions[id]);
export const useSelectedQuestionId = () =>
  useQuestionsStore((state) => state.selectedQuestionId);

export const {setQuestions, updateQuestion, setSelectedQuestionId} =
  useQuestionsStore.getState().actions;
