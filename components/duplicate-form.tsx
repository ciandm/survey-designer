'use client';

import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {z} from 'zod';
import {useDuplicateSurvey} from '@/app/(survey-builder)/_hooks/use-duplicate-survey';
import {createContext} from '@/lib/context';
import {getSiteUrl} from '@/lib/hrefs';
import {Button} from './ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {Input} from './ui/input';
import {Textarea} from './ui/textarea';

const schema = z.object({
  id: z.string(),
  title: z.string().min(1, {message: 'You must provide a title'}),
  description: z.string().optional(),
});

type DuplicateSurveyFormState = z.infer<typeof schema>;

type DuplicateSurveyFormProps = {
  children: React.ReactNode;
};

export const DuplicateSurveyForm = ({children}: DuplicateSurveyFormProps) => {
  const form = useForm<DuplicateSurveyFormState>({
    resolver: zodResolver(schema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const {mutateAsync: handleDuplicateSurvey, isPending} = useDuplicateSurvey();
  const router = useRouter();

  const onOpen = (options: {initialData: DuplicateSurveyFormState}) => {
    setIsOpen(true);
    form.reset(options.initialData);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const {survey: duplicatedSurvey} = await handleDuplicateSurvey({
        surveyId: data.id,
        title: data.title,
        description: data.description,
      });
      setIsOpen(false);
      toast.success('Survey duplicated', {
        position: 'bottom-center',
      });
      router.push(getSiteUrl.designerPage({surveyId: duplicatedSurvey.id}));
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <DuplicateSurveyProvider value={onOpen}>
        {children}
      </DuplicateSurveyProvider>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy survey</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Untitled Survey" {...field} />
                      </FormControl>
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
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="ml-auto mt-8 flex gap-2">
                <Button
                  disabled={isPending}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Make a copy
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

type Context = (options: {initialData: DuplicateSurveyFormState}) => void;

const [DuplicateSurveyProvider, useDuplicateSurveyFormTrigger] =
  createContext<Context>();

export {useDuplicateSurveyFormTrigger};
