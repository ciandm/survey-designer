'use client';

import React from 'react';
import {useForm} from 'react-hook-form';
import {ErrorMessage} from '@hookform/error-message';
import {zodResolver} from '@hookform/resolvers/zod';
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

const createFormSchema = z.object({
  title: z.string().min(1, 'You must provide a title.'),
  description: z.string().optional(),
});

type CreateFormSchema = z.infer<typeof createFormSchema>;

export const CreateForm = () => {
  const form = useForm<CreateFormSchema>({
    defaultValues: {
      title: '',
      description: '',
    },
    resolver: zodResolver(createFormSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Untitled Survey" {...field} />
                </FormControl>
                <FormDescription>
                  A good title is short and clear.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Add a description to provide context.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="ml-auto mt-8 flex">
          Create Survey
        </Button>
      </form>
    </Form>
  );
};
