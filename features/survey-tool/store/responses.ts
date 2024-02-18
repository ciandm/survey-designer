import {createContext, useContext} from 'react';
import {createStore, useStore} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {ElementSchema} from '@/lib/validations/survey';

interface ResponsesProps {
  questions: ElementSchema[];
  responses: {
    questionId: string;
    value: string[];
  }[];
  questionIds: string[];
  currentQuestionId: string;
}

interface ResponsesState extends ResponsesProps {
  actions: {
    addResponse: (response: string[]) => void;
    setCurrentQuestionId: (fn: (questionId: string) => string) => void;
    resetResponses: () => void;
  };
}

type BearStore = ReturnType<typeof createResponsesStore>;

export const createResponsesStore = (initProps?: Partial<ResponsesProps>) => {
  const DEFAULT_PROPS: ResponsesProps = {
    questions: [],
    currentQuestionId: '',
    responses: [],
    questionIds: [],
  };
  return createStore<ResponsesState>()(
    persist(
      immer((set) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        actions: {
          addResponse: (response) =>
            set((state) => {
              const exisingResponse = state.responses.find(
                (r) => r.questionId === state.currentQuestionId,
              );

              if (exisingResponse) {
                state.responses = state.responses.map((r) =>
                  r.questionId === state.currentQuestionId
                    ? {...r, value: response}
                    : r,
                );
              } else {
                state.responses.push({
                  questionId: state.currentQuestionId,
                  value: response,
                });
              }
            }),
          setCurrentQuestionId: (fn) =>
            set((state) => {
              state.currentQuestionId = fn(state.currentQuestionId);
            }),
          resetResponses: () =>
            set((state) => {
              state.responses = [];
            }),
        },
      })),
      {
        name: 'survey-responses',
      },
    ),
  );
};

export const ResponsesContext = createContext<BearStore | null>(null);

export function useResponsesContext<T>(
  selector: (state: ResponsesState) => T,
): T {
  const store = useContext(ResponsesContext);
  if (!store) throw new Error('Missing BearContext.Provider in the tree');
  return useStore(store, selector);
}
