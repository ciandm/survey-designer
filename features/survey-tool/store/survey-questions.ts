import {createContext, useContext} from 'react';
import {createStore, useStore} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {ElementSchema} from '@/lib/validations/survey';

interface SurveyQuestionsProps {
  elements: ElementSchema[];
  currentQuestionId: string;
}

interface SurveyQuestionsState extends SurveyQuestionsProps {
  actions: {
    setCurrentQuestionId: (fn: (questionId: string) => string) => void;
  };
}

type SurveyQuestionsStore = ReturnType<typeof createSurveyQuestionsStore>;

export const createSurveyQuestionsStore = (
  initProps?: Partial<SurveyQuestionsProps>,
) => {
  const DEFAULT_PROPS: SurveyQuestionsProps = {
    elements: [],
    currentQuestionId: '',
  };
  return createStore<SurveyQuestionsState>()(
    immer((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      actions: {
        setCurrentQuestionId: (fn) =>
          set((state) => {
            state.currentQuestionId = fn(state.currentQuestionId);
          }),
      },
    })),
  );
};

export const SurveyQuestionsContext =
  createContext<SurveyQuestionsStore | null>(null);

export function useResponsesContext<T>(
  selector: (state: SurveyQuestionsState) => T,
): T {
  const store = useContext(SurveyQuestionsContext);
  if (!store) throw new Error('Missing BearContext.Provider in the tree');
  return useStore(store, selector);
}
