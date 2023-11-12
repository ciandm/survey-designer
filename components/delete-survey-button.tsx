'use client';

import {useState} from 'react';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {DeleteSurveyAlert} from '@/features/survey-designer/components/delete-survey-alert';
import {useDeleteSurvey} from '@/features/survey-designer/hooks/use-delete-survey';
import {AlertDialogCancel} from './ui/alert-dialog';
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

  const {isPending: isPendingDelete, mutateAsync: deleteSurvey} =
    useDeleteSurvey();

  const handleDeleteSurvey = async () => {
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
    <>
      <Button variant="ghost" {...rest}>
        {children ?? 'Delete'}
      </Button>
      <DeleteSurveyAlert open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          disabled={isPendingDelete}
          variant="destructive"
          onClick={handleDeleteSurvey}
        >
          Delete
          {isPendingDelete && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </DeleteSurveyAlert>
    </>
  );
};
