import {ChoicesSchemaType} from '@/types/element';
import {createContext} from '@/utils/context';

type Context = {
  focus: {
    focusIndex: number | null;
    setFocusIndex: React.Dispatch<React.SetStateAction<number | null>>;
    focusInputs: React.MutableRefObject<HTMLInputElement[]>;
  };
  handlers: {
    handleInsertChoice: () => void;
    handleRemoveChoice: (choiceId: string) => void;
    handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleRemoveAll: () => void;
  };
  choices: ChoicesSchemaType;
  elementId: string;
};

export const [ChoicesContextProvider, useChoicesContext] =
  createContext<Context>();
