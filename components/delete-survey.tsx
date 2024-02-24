'use client';

import React, {useState, useTransition} from 'react';
import {Slot} from '@radix-ui/react-slot';
import {Loader2} from 'lucide-react';
import {usePathname, useRouter} from 'next/navigation';
import {deleteSurvey} from '@/features/survey-designer/actions/survey';
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
  const {setSurveyId, surveyId, handleDeleteSurvey, isDeletePending} =
    useDeleteSurvey();

  const onOpenChange = (open: boolean) => {
    setSurveyId((prev) => (open ? prev : ''));
  };

  const onTriggerClick = (surveyId: string) => {
    setSurveyId(surveyId);
  };

  return (
    <>
      <DeleteSurveyDialogProvider value={{onTriggerClick, isDeletePending}}>
        {children}
      </DeleteSurveyDialogProvider>
      <AlertDialog open={!!surveyId} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              survey.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Cancel
            </AlertDialogCancel>
            <Button
              disabled={isDeletePending}
              variant="destructive"
              onClick={() => handleDeleteSurvey(surveyId)}
            >
              Delete
              {isDeletePending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const DeleteSurveyDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {surveyId: string}
>(({children, asChild, surveyId, ...rest}, ref) => {
  const {onTriggerClick, isDeletePending} = useDeleteSurveyDialogContext();

  const Comp = asChild ? Slot : Button;

  return (
    <Comp
      onClick={() => onTriggerClick(surveyId)}
      {...rest}
      ref={ref}
      disabled={isDeletePending}
    >
      {children}
    </Comp>
  );
});

DeleteSurveyDialogTrigger.displayName = 'DeleteSurveyDialogTrigger';

const [DeleteSurveyDialogProvider, useDeleteSurveyDialogContext] =
  createContext<{
    onTriggerClick: (surveyId: string) => void;
    isDeletePending: boolean;
  }>();

const useDeleteSurvey = () => {
  const [surveyId, setSurveyId] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleDeleteSurvey = async (surveyId: string) => {
    startTransition(async () => {
      await deleteSurvey(surveyId);
      setSurveyId('');
      if (pathname.includes('editor')) {
        router.push('/');
      }
      router.refresh();
    });
  };

  return {
    handleDeleteSurvey,
    isDeletePending: isPending,
    surveyId,
    setSurveyId,
  };
};
