import { create } from "zustand";

interface State {
  questionId: string;
  actions: {
    setQuestion: (question: string) => void;
  };
}

const useQuestionStore = create<State>()((set) => ({
  questionId: "",
  actions: {
    setQuestion: (question) => set({ questionId: question }),
  },
}));

export const useSelectedQuestion = () =>
  useQuestionStore((state) => state.questionId);
export const useSetSelectedQuestion = () =>
  useQuestionStore((state) => state.actions.setQuestion);
