import {createContext} from '@/utils/context';

export const [SettingsInputContextProvider, useSettingsInputContext] =
  createContext<{
    id: string;
  }>();
