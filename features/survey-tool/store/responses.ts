import {createContext, useContext} from 'react';
import {createStore, useStore} from 'zustand';

interface ResponsesProps {
  responses: {
    questionId: string;
    response: string;
  }[];
  questionIds: string[];
  currentQuestionId: string;
}

interface ResponsesState extends ResponsesProps {
  actions: {
    addResponse: (response: string) => void;
    setCurrentQuestionId: (fn: (questionId: string) => string) => void;
    resetResponses: () => void;
  };
}

type BearStore = ReturnType<typeof createResponsesStore>;

export const createResponsesStore = (initProps?: Partial<ResponsesProps>) => {
  const DEFAULT_PROPS: ResponsesProps = {
    currentQuestionId: '',
    responses: [],
    questionIds: [],
  };
  return createStore<ResponsesState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    actions: {
      addResponse: (response) =>
        set((state) => {
          const exisingResponse = state.responses.find(
            (r) => r.questionId === state.currentQuestionId,
          );

          if (exisingResponse) {
            return {
              responses: state.responses.map((r) =>
                r.questionId === state.currentQuestionId ? {...r, response} : r,
              ),
            };
          }

          return {
            responses: [
              ...state.responses,
              {
                questionId: state.currentQuestionId,
                response,
              },
            ],
          };
        }),
      setCurrentQuestionId: (fn) =>
        set((state) => ({
          currentQuestionId: fn(state.currentQuestionId),
        })),
      resetResponses: () =>
        set(() => ({
          responses: [],
        })),
    },
  }));
};

export const ResponsesContext = createContext<BearStore | null>(null);

export function useResponsesContext<T>(
  selector: (state: ResponsesState) => T,
): T {
  const store = useContext(ResponsesContext);
  if (!store) throw new Error('Missing BearContext.Provider in the tree');
  return useStore(store, selector);
}
