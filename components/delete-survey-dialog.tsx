'use client';

import React, {useState} from 'react';
import {XCircleIcon} from '@heroicons/react/20/solid';
import {Loader2} from 'lucide-react';
import {useAction} from 'next-safe-action/hooks';
import {createContext} from '@/lib/context';
import {deleteSurveyAction} from '@/survey-dashboard/_actions/delete-survey';
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
  children: React.ReactNode;
};

export const DeleteSurveyDialog = ({children}: DeleteSurveyProps) => {
  const {
    isOpen,
    handleDeleteSurvey,
    handleCloseDialog,
    handleTriggerDeleteSurveyConfirm,
    status,
    options,
  } = useDeleteSurveyDialog();

  return (
    <>
      <DeleteSurveyDialogProvider value={{handleTriggerDeleteSurveyConfirm}}>
        {children}
      </DeleteSurveyDialogProvider>
      <AlertDialog open={isOpen} onOpenChange={handleCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {status === 'hasErrored' && (
              <div className="mb-2 flex gap-2 rounded-md bg-red-50 p-4 text-red-400">
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                <p className="text-sm">
                  An error occurred while trying to delete the survey. Please
                  try again.
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
              onClick={() =>
                handleDeleteSurvey({surveyId: options?.surveyId ?? ''})
              }
            >
              Delete
              {status === 'executing' && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

type DeleteSurveyOptions = {
  surveyId: string;
  catchError?: boolean;
};

const [DeleteSurveyDialogProvider, useDeleteSurveyDialogTrigger] =
  createContext<{
    handleTriggerDeleteSurveyConfirm: (
      options: DeleteSurveyOptions,
    ) => Promise<void>;
  }>();

const useDeleteSurveyDialog = () => {
  const [options, setOptions] = useState<DeleteSurveyOptions | null>(null);
  const awaitingPromiseRef = React.useRef<{
    resolve: () => void;
    reject: () => void;
  }>();

  const {execute: handleDeleteSurvey, ...rest} = useAction(deleteSurveyAction, {
    onSuccess: () => {
      if (awaitingPromiseRef.current) {
        awaitingPromiseRef.current.resolve();
      }
      setOptions(null);
    },
  });

  const handleTriggerDeleteSurveyConfirm = (options: DeleteSurveyOptions) => {
    setOptions(options);
    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = {resolve, reject};
    });
  };

  const handleCloseDialog = () => {
    if (options?.catchError && awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
    setOptions(null);
  };

  const isOpen = !!options;

  return {
    isOpen,
    handleDeleteSurvey,
    handleTriggerDeleteSurveyConfirm,
    handleCloseDialog,
    options,
    ...rest,
  };
};

export {useDeleteSurveyDialogTrigger};
