'use client';

import {getUser} from '@/lib/auth';
import {createContext} from '@/lib/context';

type ContextType = Awaited<ReturnType<typeof getUser>>;

const [Provider, useSession] = createContext<ContextType>();

export const SessionProvider = ({
  value,
  children,
}: React.PropsWithChildren<{
  value: ContextType;
}>) => {
  return <Provider value={value}>{children}</Provider>;
};

export {useSession};
