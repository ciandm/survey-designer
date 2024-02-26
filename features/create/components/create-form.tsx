'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
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
import {useCreateSurvey} from '@/features/survey-designer/hooks/use-create-survey';
import {getSiteUrl} from '@/lib/hrefs';

const createFormSchema = z.object({
  title: z.string().min(1, 'You must provide a title.'),
  description: z.string().optional(),
});

type CreateFormSchema = z.infer<typeof createFormSchema>;

export const CreateForm = () => {
  const {form, onSubmit, isPending, isSuccess} = useCreateForm();

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
        <Button
          type="submit"
          className="ml-auto mt-8 flex"
          disabled={isPending || isSuccess}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Creating...' : 'Create survey'}
        </Button>
      </form>
    </Form>
  );
};

const useCreateForm = () => {
  const router = useRouter();
  const {mutateAsync: handleCreateSurvey, ...rest} = useCreateSurvey();
  const form = useForm<CreateFormSchema>({
    defaultValues: {
      title: '',
      description: '',
    },
    resolver: zodResolver(createFormSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const {survey} = await handleCreateSurvey(data);
      toast.success('Survey created successfully', {
        position: 'bottom-center',
        description: 'Redirecting...',
      });
      router.push(getSiteUrl.designerPage({surveyId: survey.id}));
    } catch (error) {
      console.log(error);
    }
  });

  return {
    form,
    onSubmit,
    ...rest,
  };
};
