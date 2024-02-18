import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

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

const useActiveElementRefStore = create<ActiveElementStoreState>()(
  immer((set) => ({
    activeElementRef: null,
    actions: {
      setActiveElementRef: (id) => {
        console.log(id);
        set(() => ({
          activeElementRef: id,
        }));
      },
    },
  })),
);

export const useActiveElementRef = () =>
  useActiveElementRefStore((state) => state.activeElementRef);

export const {setActiveElementRef} =
  useActiveElementRefStore.getState().actions;
