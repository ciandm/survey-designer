'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {z} from 'zod';
import {Button} from '@/components/ui';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui';
import {Input} from '@/components/ui';
import {registerSchema} from '@/lib/validations/auth';
import {getSiteUrl} from '@/utils/hrefs';
import {registerAction} from '../actions/register-action';
import {ErrorAlert} from './error-alert';

type RegisterFormState = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterFormState>({
    defaultValues: {
      password: '',
      email: '',
    },
    resolver: zodResolver(registerSchema),
  });
  const [errors, setErrors] = useState<string[] | null>(null);

  const {execute: handleRegisterUser, status} = useAction(registerAction, {
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

  const onSubmit = form.handleSubmit(async (data) => {
    setErrors(null);
    handleRegisterUser(data);
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
            disabled={status === 'executing' || status === 'hasSucceeded'}
            type="submit"
            className="w-full"
          >
            {status === 'hasSucceeded' ? 'Redirecting...' : 'Create account'}
            {status === 'executing' && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
