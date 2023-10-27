'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {Survey} from '@prisma/client';
import {debounce} from 'lodash';
import merge from 'lodash/merge';
import {createStore, StoreApi, useStore} from 'zustand';
import {
  Configuration,
  configurationSchema,
  FieldConfig,
} from '@/lib/validations/question';
import {setSelectedFieldId} from '@/stores/selected-field.ts';

interface State extends Configuration {
  survey: {
    title: string;
    description?: string;
  };
  actions: Actions;
}

interface Actions {
  updateQuestion: (question: Partial<FieldConfig> & {id: string}) => void;
}

interface Props
  extends PropsWithChildren<{
    survey: Survey;
  }> {}

const StoreContext = createContext<StoreApi<State> | null>(null);

export const SurveySchemaInitialiser = ({children, survey}: Props) => {
  const parsedSchema = configurationSchema.safeParse(survey.schema);

  if (!parsedSchema.success) {
    throw new Error('Invalid schema');
  }

  const storeRef = useRef<StoreApi<State>>();

  if (!storeRef.current) {
    storeRef.current = createStore<State>()((set) => ({
      ...parsedSchema.data,
      survey: {
        title: survey.name,
        description: '',
      },
      actions: {
        updateQuestion: (question) =>
          set((state) => ({
            fields: state.fields.map((q) =>
              q.id === question.id ? merge(q, question) : q,
            ),
          })),
      },
    }));

    if (parsedSchema.data.fields.length > 0) {
      setSelectedFieldId(parsedSchema.data.fields[0].id);
    }
  }

  useEffect(() => {
    const fn = debounce((data: any) => {
      console.log(data);
    }, 1000);
    const unsub = storeRef.current?.subscribe((state, prevState) => {
      fn(state);
    });

    return () => {
      unsub?.();
    };
  }, []);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useSurveySchemaStore = <T,>(selector: (state: State) => T) => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }
  return useStore(store, selector);
};

export const useSurveySchemaActions = () => {
  const actions = useSurveySchemaStore((state) => state.actions);
  return actions;
};
