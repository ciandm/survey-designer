import {createStore, StoreApi, useStore} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {createContext} from '@/utils/context';

type ActiveElementIdStoreProps = {
  activeElementId: string | null;
};

type ActiveElementIdStoreActions = {
  setActiveElementId: (
    id: ActiveElementIdStoreProps['activeElementId'],
  ) => void;
};

export type ActiveElementIdStoreState = ActiveElementIdStoreProps & {
  actions: ActiveElementIdStoreActions;
};

export const createActiveElementStore = (
  initProps: Partial<ActiveElementIdStoreProps> = {},
) => {
  const initialState: ActiveElementIdStoreProps = {
    activeElementId: null,
    ...initProps,
  };

  return createStore<ActiveElementIdStoreState>()(
    immer((set) => ({
      ...initialState,
      actions: {
        setActiveElementId: (id) => {
          set(() => ({
            activeElementId: id,
          }));
        },
      },
    })),
  );
};

const [ActiveElementStoreProvider, useActiveElementContext] =
  createContext<StoreApi<ActiveElementIdStoreState>>();

export const useActiveElementId = () => {
  const store = useActiveElementContext();
  return useStore(store, (state) => state.activeElementId);
};

export const useActiveElementActions = () => {
  const store = useActiveElementContext();
  return useStore(store, (state) => state.actions);
};

export {ActiveElementStoreProvider};
