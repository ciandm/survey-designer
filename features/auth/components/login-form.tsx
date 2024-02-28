'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {Loader2, XCircleIcon} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {axios} from '@/lib/api/axios';
import {getSiteUrl} from '@/lib/hrefs';
import {loginSchema} from '../validation/login';

type LoginFormState = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginFormState>({
    defaultValues: {
      password: '',
      username: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState<string | null>(null);

  const {
    mutateAsync: handleLogIn,
    isPending,
    isSuccess,
  } = useMutation<void, Error, LoginFormState>({
    mutationFn: async (data) => {
      const {data: repsonse} = await axios.post('/auth/log-in', data);
      return repsonse;
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setError(null);
    try {
      await handleLogIn(data);
      router.push(getSiteUrl.homePage());
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
      console.error(error);
    }
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          <FormField
            control={form.control}
            name="username"
            render={({field}) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center">
            <div className="ml-auto text-sm leading-6">
              <Button variant="link" className="p-0" asChild>
                <Link href="#">Forgot password?</Link>
              </Button>
            </div>
          </div>
          <Button
            disabled={isPending || isSuccess}
            type="submit"
            className="w-full"
          >
            {isSuccess ? 'Logging in...' : 'Log in'}
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </>
  );
};
