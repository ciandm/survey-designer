'use client';

import {getUser} from '@/lib/auth';
import {createContext} from '@/utils/context';

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
