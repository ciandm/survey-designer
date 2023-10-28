'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {Survey} from '@prisma/client';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {debounce} from 'lodash';
import merge from 'lodash/merge';
import {v4 as uuidv4} from 'uuid';
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
  updateField: (question: Partial<FieldConfig> & {id: string}) => void;
  updateFieldChoices: (params: {
    fieldId: string;
    choices: FieldConfig['properties']['choices'];
  }) => void;
  insertField: (
    question: Pick<FieldConfig, 'type'> & {indexAt?: number},
  ) => void;
  deleteField: (question: Pick<FieldConfig, 'ref'>) => void;
  duplicateField: (question: Pick<FieldConfig, 'ref'>) => void;
}

interface Props
  extends PropsWithChildren<{
    survey: Survey;
  }> {}

const StoreContext = createContext<StoreApi<State> | null>(null);

export const SurveySchemaInitialiser = ({children, survey}: Props) => {
  const parsedSchema = configurationSchema.safeParse(survey.schema);
  const {mutate} = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put(
        `/api/v1/surveys/${survey.id}/schema`,
        {
          ...data,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return res.data;
    },
    mutationKey: ['survey-schema', survey.id],
  });

  if (!parsedSchema.success) {
    console.log(parsedSchema.error.format());
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
        updateField: (field) =>
          set((state) => ({
            fields: state.fields.map((q) =>
              q.id === field.id ? merge(q, field) : q,
            ),
          })),
        updateFieldChoices: ({fieldId, choices}) =>
          set((state) => ({
            fields: state.fields.map((q) =>
              q.id === fieldId
                ? {...q, properties: {...q.properties, choices}}
                : q,
            ),
          })),
        insertField: ({type, indexAt}) => {
          const ref = uuidv4();
          set((state) => {
            const fields = [...state.fields];
            if (indexAt !== undefined) {
              fields.splice(indexAt, 0, {
                id: uuidv4(),
                ref,
                type,
                text: '',
                description: '',
                properties: {},
              });
              return {
                fields,
              };
            }
            return {
              fields: [
                ...state.fields,
                {
                  id: uuidv4(),
                  ref,
                  type,
                  text: '',
                  description: '',
                  properties: {},
                },
              ],
            };
          });
          setSelectedFieldId(ref);
        },
        deleteField: ({ref}) => {
          const fields = storeRef.current?.getState().fields || [];
          if (fields.length === 1) return;

          const indexOfFieldToDelete = fields.findIndex((q) => q.ref === ref);

          const prevItem = fields[indexOfFieldToDelete - 1];
          const nextItem = fields[indexOfFieldToDelete + 1];

          if (prevItem) {
            setSelectedFieldId(prevItem.ref);
          } else if (nextItem) {
            setSelectedFieldId(nextItem.ref);
          } else {
            setSelectedFieldId('');
          }

          return set((state) => ({
            fields: state.fields.filter((q) => q.ref !== ref),
          }));
        },
        duplicateField: ({ref}) => {
          const newRef = uuidv4();
          setSelectedFieldId(newRef);
          set((state) => {
            const field = state.fields.find((q) => q.ref === ref);
            if (!field) return state;
            const newField = {
              ...field,
              text: `${field.text} (copy)`,
              ref: newRef,
              id: uuidv4(),
            };
            const fields = [...state.fields];
            fields.splice(
              state.fields.findIndex((q) => q.ref === ref) + 1,
              0,
              newField,
            );
            return {
              fields,
            };
          });
        },
      },
    }));

    if (parsedSchema.data.fields.length > 0) {
      setSelectedFieldId(parsedSchema.data.fields[0].ref);
    }
  }

  useEffect(() => {
    const fn = debounce((data: any) => {
      mutate(data);
    }, 1000);
    const unsub = storeRef.current?.subscribe((state, prevState) => {
      fn(state);
    });

    return () => {
      unsub?.();
    };
  }, [mutate]);

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
