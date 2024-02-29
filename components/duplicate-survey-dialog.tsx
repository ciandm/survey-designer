'use client';

import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {z} from 'zod';
import {createContext} from '@/lib/context';
import {getSiteUrl} from '@/lib/hrefs';
import {createSurveyAction} from '@/survey-dashboard/_actions/create-survey';
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

export const DuplicateSurveyDialog = ({children}: DuplicateSurveyFormProps) => {
  const {
    form,
    isOpen,
    status,
    onSubmit,
    handleTriggerDuplicateSurveyDialog,
    setIsOpen,
  } = useDuplicateSurveyForm();

  return (
    <>
      <DuplicateSurveyProvider
        value={{
          handleTriggerDuplicateSurveyDialog,
        }}
      >
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
                  disabled={status === 'executing'}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={status === 'executing'}>
                  {status === 'executing' && (
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

type Context = {
  handleTriggerDuplicateSurveyDialog: (options: {
    initialData: DuplicateSurveyFormState;
  }) => void;
};

const [DuplicateSurveyProvider, useDuplicateSurveyFormTrigger] =
  createContext<Context>();

export {useDuplicateSurveyFormTrigger};

const useDuplicateSurveyForm = () => {
  const form = useForm<DuplicateSurveyFormState>({
    resolver: zodResolver(schema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const {execute: handleDuplicateSurvey, status} = useAction(
    createSurveyAction,
    {
      onSuccess: ({survey}) => {
        setIsOpen(false);
        toast.success('Survey duplicated', {
          position: 'bottom-center',
        });
        router.push(getSiteUrl.designerPage({surveyId: survey.id}));
      },
    },
  );
  const router = useRouter();

  const handleTriggerDuplicateSurveyDialog = (options: {
    initialData: DuplicateSurveyFormState;
  }) => {
    setIsOpen(true);
    form.reset(options.initialData);
  };

  const onSubmit = form.handleSubmit((data) => {
    handleDuplicateSurvey({
      duplicatedFrom: data.id,
      title: data.title,
      description: data.description,
    });
  });

  return {
    form,
    isOpen,
    status,
    onSubmit,
    handleTriggerDuplicateSurveyDialog,
    setIsOpen,
  };
};
