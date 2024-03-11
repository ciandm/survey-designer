import {createContext} from '@/utils/context';
import {UseDesignerReturn} from './use-designer';

type Context = Pick<UseDesignerReturn, 'handlers'>['handlers'];

export const [DesignerHandlerProvider, useDesignerHandlers] =
  createContext<Context>();
