import {create} from 'zustand';

type ActiveElementStoreProps = {
  activeElementRef: string | null;
};

type ActiveElementStoreActions = {
  setActiveElementRef: (
    id: ActiveElementStoreProps['activeElementRef'],
  ) => void;
};

export type ActiveElementStoreState = ActiveElementStoreProps & {
  actions: ActiveElementStoreActions;
};

export const useActiveElementRef = create<ActiveElementStoreState>()((set) => ({
  activeElementRef: null,
  actions: {
    setActiveElementRef: (id) => {
      set(() => ({
        activeElementRef: id,
      }));
    },
  },
}));

export const useActiveElementId = () =>
  useActiveElementRef((state) => state.activeElementRef);

export const {setActiveElementRef} = useActiveElementRef.getState().actions;
