'use client';

import {useMutation} from '@tanstack/react-query';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {axios} from '@/lib/api/axios';
import {getSiteUrl} from '@/lib/hrefs';

export const SignOutButton = () => {
  const router = useRouter();
  const {mutateAsync: handleLogOut, isPending} = useMutation<void, Error, void>(
    {
      mutationFn: async () => {
        await axios.delete('/auth/log-out');
      },
    },
  );

  const onClick = async () => {
    await handleLogOut();
    router.push(getSiteUrl.loginPage());
  };

  return (
    <Button variant="secondary" onClick={onClick} disabled={isPending}>
      Sign out
      {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
};
