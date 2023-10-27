import {create} from 'zustand';
import {useSurveySchemaStore} from '@/components/survey-schema-initiailiser';

interface State {
  selectedFieldId: string;
  actions: {
    setSelectedFieldId: (fieldId: string) => void;
  };
}

const useSelectedFieldStore = create<State>((set) => ({
  selectedFieldId: '',
  actions: {
    setSelectedFieldId: (fieldId) => set({selectedFieldId: fieldId}),
  },
}));

export const useSelectedFieldId = () =>
  useSelectedFieldStore((state) => state.selectedFieldId);

export const {setSelectedFieldId} = useSelectedFieldStore.getState().actions;

export const useSelectedField = () => {
  const fields = useSurveySchemaStore((state) => state.fields);
  const selectedFieldId = useSelectedFieldId();

  return fields.find((field) => field.id === selectedFieldId);
};
