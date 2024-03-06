'use client';

import {UserCircleIcon} from '@heroicons/react/20/solid';
import {User} from '@prisma/client';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {logOutAction} from '@/auth/_actions/log-out-action';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {getSiteUrl} from '@/utils/hrefs';

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'username'>;
}

export function UserAccountNav({user}: UserAccountNavProps) {
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
          <AvatarFallback className="bg-transparent text-white hover:bg-blue-800/20">
            <span className="sr-only">{user.username}</span>
            <UserCircleIcon className="h-6 w-6" />
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
