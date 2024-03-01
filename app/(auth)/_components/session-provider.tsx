'use client';

import {getUser} from '@/lib/auth';
import {createContext} from '@/lib/context';

type ContextType = Pick<Awaited<ReturnType<typeof getUser>>, 'user'>;

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
