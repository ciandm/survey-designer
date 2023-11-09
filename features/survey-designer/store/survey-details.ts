import {create} from 'zustand';
import {useShallow} from 'zustand/react/shallow';

type SurveyDetailsStoreProps = {
  id: string;
  title: string;
  description?: string;
};

type SurveyDetailsStoreActions = {
  updateTitle: (title: string) => void;
  updateDescription: (description: string) => void;
};

export type SurveyDetailsStoreState = SurveyDetailsStoreProps & {
  actions: SurveyDetailsStoreActions;
};

export const useSurveyDetailsStore = create<SurveyDetailsStoreState>()(
  (set) => ({
    id: '',
    title: '',
    description: '',
    actions: {
      updateTitle: (title) => {
        set((state) => ({
          ...state,
          title,
        }));
      },
      updateDescription: (description) => {
        set((state) => ({
          ...state,
          description,
        }));
      },
    },
  }),
);

export const useSurveyDetails = () =>
  useSurveyDetailsStore(
    useShallow((state) => ({
      id: state.id,
      title: state.title,
      description: state.description,
    })),
  );
export const useSurveyDetailsActions = () =>
  useSurveyDetailsStore((state) => state.actions);
