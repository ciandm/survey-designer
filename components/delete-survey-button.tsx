'use client';

import {useState} from 'react';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {useDeleteSurvey} from '@/features/survey-designer/hooks/use-delete-survey';
import {Button, ButtonProps} from './ui/button';
import {useToast} from './ui/use-toast';

export const DeleteSurveyButton = ({
  surveyId,
  children,
  ...rest
}: {surveyId: string} & ButtonProps) => {
  const {toast} = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {isPending, mutateAsync: deleteSurvey} = useDeleteSurvey();

  const handleOnDelete = async () => {
    try {
      await deleteSurvey({surveyId});
      toast({
        title: 'Survey deleted',
        description: 'The survey was deleted successfully.',
      });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" {...rest}>
          {children ?? 'Delete'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will delete permanently the
            survey.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button disabled={isPending} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button disabled={isPending} type="submit" onClick={handleOnDelete}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
