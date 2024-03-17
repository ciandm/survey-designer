'use client';

import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {getSiteUrl} from '@/utils/hrefs';
import {logOutAction} from '../actions/log-out-action';

export const LogOut = () => {
  const router = useRouter();
  const {execute: handleLogOut, status} = useAction(logOutAction, {
    onSuccess: () => {
      router.push(getSiteUrl.loginPage());
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.');
    },
  });

  const onClick = () => {
    handleLogOut({});
  };

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      disabled={status === 'executing'}
    >
      Sign out
      {status === 'executing' && (
        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      )}
    </Button>
  );
};
