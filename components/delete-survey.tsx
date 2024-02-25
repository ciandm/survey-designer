'use client';

import React, {useState} from 'react';
import {Slot} from '@radix-ui/react-slot';
import {useMutation} from '@tanstack/react-query';
import {Loader2} from 'lucide-react';
import {deleteSurvey} from '@/lib/api/survey';
import {createContext} from '@/lib/context';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {Button, ButtonProps} from './ui/button';

type DeleteSurveyProps = {
  children: React.ReactNode;
};

export const DeleteSurveyDialog = ({children}: DeleteSurveyProps) => {
  const {isOpen, onDeleteSurvey, onOpenConfirmation, onClose, status} =
    useDeleteSurveyDialog();

  return (
    <>
      <DeleteSurveyDialogProvider value={onOpenConfirmation}>
        {children}
      </DeleteSurveyDialogProvider>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              survey.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={status === 'pending'}>
              Cancel
            </AlertDialogCancel>
            <Button
              disabled={status === 'pending'}
              variant="destructive"
              onClick={onDeleteSurvey}
            >
              Delete
              {status === 'pending' && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const DeleteSurveyTrigger = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {surveyId: string; onDeleted?: () => void}
>(({children, asChild, surveyId, onDeleted, ...rest}, ref) => {
  const onConfirmDelete = useDeleteSurveyConfirm();
  const Comp = asChild ? Slot : Button;

  return (
    <Comp
      onClick={() => onConfirmDelete({surveyId}).then(onDeleted)}
      {...rest}
      ref={ref}
    >
      {children}
    </Comp>
  );
});

type DeleteSurveyOptions = {
  surveyId: string;
  catchError?: boolean;
};

DeleteSurveyTrigger.displayName = 'DeleteSurveyDialogTrigger';

const [DeleteSurveyDialogProvider, useDeleteSurveyConfirm] =
  createContext<(options: DeleteSurveyOptions) => Promise<void>>();

const useDeleteSurveyDialog = () => {
  const [options, setOptions] = useState<DeleteSurveyOptions | null>(null);
  const awaitingPromiseRef = React.useRef<{
    resolve: () => void;
    reject: () => void;
  }>();
  const {mutateAsync: handleDeleteSurvey, status} = useMutation<
    void,
    Error,
    void
  >({
    mutationFn: async () => deleteSurvey(options?.surveyId ?? ''),
  });

  const onOpenConfirmation = (options: DeleteSurveyOptions) => {
    setOptions(options);
    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = {resolve, reject};
    });
  };

  const onClose = () => {
    if (options?.catchError && awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
    setOptions(null);
  };

  const onDeleteSurvey = async () => {
    await handleDeleteSurvey();
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }

    setOptions(null);
  };

  const isOpen = !!options;

  return {
    isOpen,
    onDeleteSurvey,
    onOpenConfirmation,
    onClose,
    status,
  };
};

export {useDeleteSurveyConfirm};
