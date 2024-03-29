'use client';

import {UserCircleIcon} from '@heroicons/react/20/solid';
import {User} from '@prisma/client';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Avatar, AvatarFallback} from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import {logOutAction} from '@/features/auth/actions/log-out-action';
import {cn} from '@/utils/classnames';
import {getSiteUrl} from '@/utils/hrefs';

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'username'>;
  isOnDarkBg?: boolean;
}

export function UserAccountNav({
  user,
  isOnDarkBg = false,
}: UserAccountNavProps) {
  const router = useRouter();
  const {execute: handleLogOut, status} = useAction(logOutAction, {
    onSuccess: () => {
      router.push(getSiteUrl.loginPage());
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.');
    },
  });

  const handleClickSignOut = (e: Event) => {
    e.preventDefault();
    handleLogOut({});
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-9 w-9 bg-transparent">
          <AvatarFallback
            className={cn(
              isOnDarkBg
                ? 'bg-transparent text-white hover:bg-white/10'
                : 'bg-white/10 text-foreground hover:bg-muted',
            )}
          >
            <span className="sr-only">{user.username}</span>
            <UserCircleIcon className={cn('h-6 w-6')} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.username && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.username}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={handleClickSignOut}
        >
          Sign out
          {status === 'executing' && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
