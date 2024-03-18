import React from 'react';
import {Dialog, DialogContent} from '@/components/ui';
import {UseSurveyFormReturn} from '@/hooks/use-survey-form';
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

type SurveyDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  form: UseSurveyFormReturn;
  onSubmit: () => void;
};

export const SurveyDialog = ({
  isOpen,
  onOpenChange,
  header,
  form,
  onSubmit,
  actions,
}: SurveyDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent>
      {header}
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
          {actions}
        </form>
      </Form>
    </DialogContent>
  </Dialog>
);
