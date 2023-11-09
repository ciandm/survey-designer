import {create} from 'zustand';

type DesignerModeStoreProps = {
  mode: 'edit' | 'preview';
};

type DesignerModeStoreActions = {
  updateMode: (mode: DesignerModeStoreProps['mode']) => void;
};

export type DesignerModeStoreState = DesignerModeStoreProps & {
  actions: DesignerModeStoreActions;
};

export const useDesignerModeStore = create<DesignerModeStoreState>()((set) => ({
  mode: 'edit',
  actions: {
    updateMode: (mode) => {
      set(() => ({
        mode,
      }));
    },
  },
}));

export const useDesignerMode = () =>
  useDesignerModeStore((state) => state.mode);
export const useDesignerModeActions = () =>
  useDesignerModeStore((state) => state.actions);
