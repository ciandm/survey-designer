'use client';

import {Loader2} from 'lucide-react';
import {Button} from '../ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {Input} from '../ui/input';
import {Textarea} from '../ui/textarea';
import {
  useDuplicateSurveyForm,
  UseDuplicateSurveyFormProps,
} from './use-duplicate-survey-form';

type DuplicateSurveyFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data?: UseDuplicateSurveyFormProps['data'];
};

export const DuplicateSurveyDialog = ({
  isOpen,
  onOpenChange,
  data,
}: DuplicateSurveyFormProps) => {
  const {form, status, onSubmit} = useDuplicateSurveyForm({data});

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                onClick={() => onOpenChange(false)}
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
  );
};
