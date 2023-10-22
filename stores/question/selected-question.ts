import {StateCreator, StoreApi} from 'zustand';
import {immer} from 'zustand/middleware/immer';

interface State {
  questionId: string;
  actions: {
    setQuestion: (question: string) => void;
  };
}

type ImmerStateCreator<T> = StateCreator<
  T,
  [['zustand/immer', never], never],
  [],
  T
>;

export const createSelectedQuestionSlice: ImmerStateCreator<State> = (
  set: StoreApi<State>['setState'],
) => ({
  questionId: '',
  actions: {
    setQuestion: (question) => set({questionId: question}),
  },
});

export const useSelectedQuestion = () =>
  useQuestionStore((state) => state.questionId);
export const useSetSelectedQuestion = () =>
  useQuestionStore((state) => state.actions.setQuestion);
