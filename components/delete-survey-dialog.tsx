'use client';

import {XCircleIcon} from '@heroicons/react/20/solid';
import {Loader2} from 'lucide-react';
import {useAction} from 'next-safe-action/hooks';
import {deleteSurveyAction} from '@/features/survey-designer/actions/delete-survey';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {Button} from './ui/button';

type DeleteSurveyProps = {
  id: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
};

export const DeleteSurveyDialog = ({
  id,
  isOpen,
  onOpenChange,
  onSuccess,
}: DeleteSurveyProps) => {
  const {execute: handleDeleteSurvey, status} = useAction(deleteSurveyAction, {
    onSuccess,
  });
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {status === 'hasErrored' && (
            <div className="mb-2 flex gap-2 rounded-md bg-red-50 p-4 text-red-400">
              <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              <p className="text-sm">
                An error occurred while trying to delete the survey. Please try
                again.
              </p>
            </div>
          )}
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            survey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={status === 'executing'}>
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={status === 'executing'}
            variant="destructive"
            onClick={() => handleDeleteSurvey({surveyId: id})}
          >
            Delete
            {status === 'executing' && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
