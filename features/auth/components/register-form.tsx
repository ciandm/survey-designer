'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {Loader2, XCircleIcon} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {axios} from '@/lib/api/axios';
import {getSiteUrl} from '@/lib/hrefs';
import {loginSchema} from '@/lib/validations/auth';

type RegisterFormState = z.infer<typeof loginSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterFormState>({
    defaultValues: {
      password: '',
      email: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState<string | null>(null);

  const {
    mutateAsync: handleRegisterUser,
    isPending,
    isSuccess,
  } = useMutation<void, Error, RegisterFormState>({
    mutationFn: async (data) => {
      const {data: response} = await axios.post('/auth/register', data);
      return response;
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setError(null);
    try {
      await handleRegisterUser(data);
      router.push(getSiteUrl.homePage());
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
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
            name="email"
            render={({field}) => (
              <FormItem className="w-full">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@company.com"
                    type="email"
                    {...field}
                  />
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
                <FormDescription>
                  Choose a strong password with at least 8 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending || isSuccess}
            type="submit"
            className="w-full"
          >
            {isSuccess ? 'Redirecting...' : 'Create account'}
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </>
  );
};
