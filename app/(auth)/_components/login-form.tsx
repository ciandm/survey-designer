'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {z} from 'zod';
import {loginAction} from '@/auth/_actions/login-action';
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
import {loginSchema} from '@/lib/validations/auth';
import {getSiteUrl} from '@/utils/hrefs';
import {ErrorAlert} from './error-alert';

type LoginFormState = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginFormState>({
    defaultValues: {
      password: '',
      email: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const [errors, setErrors] = useState<string[] | null>(null);
  const {execute: handleLogIn, status} = useAction(loginAction, {
    onSuccess: (data) => {
      if (data.success) {
        router.push(getSiteUrl.dashboardPage());
      }
    },
    onError: (error) => {
      if (error.serverError) {
        setErrors([error.serverError]);
      } else if (error.validationErrors) {
        Object.values(error.validationErrors).forEach((e) => {
          setErrors((prev) => [...(prev || []), ...e]);
        });
      } else {
        setErrors(['Something went wrong. Please try again.']);
      }
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setErrors(null);
    handleLogIn(data);
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {errors && <ErrorAlert errors={errors} />}
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem className="w-full">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@company.com"
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
            disabled={status === 'executing' || status === 'hasSucceeded'}
            type="submit"
            className="w-full"
          >
            {status === 'hasSucceeded' ? 'Logging in...' : 'Log in'}
            {status === 'executing' && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
