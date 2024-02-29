'use client';

import {useMutation} from '@tanstack/react-query';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {axios} from '@/lib/api/axios';
import {getSiteUrl} from '@/lib/hrefs';

export const LogOut = () => {
  const router = useRouter();
  const {mutateAsync: handleLogOut, isPending} = useMutation<void, Error, void>(
    {
      mutationFn: async () => {
        await axios.delete('/auth/log-out');
      },
    },
  );

  const onClick = async () => {
    try {
      await handleLogOut();
      router.push(getSiteUrl.loginPage());
    } catch {
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <Button variant="secondary" onClick={onClick} disabled={isPending}>
      Sign out
      {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
    </Button>
  );
};
