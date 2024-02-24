'use client';

import {useState} from 'react';
import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {toast} from '@/components/ui/use-toast';
import {useDeleteSurvey} from '../hooks/use-delete-survey';
import {useDuplicateSurvey} from '../hooks/use-duplicate-survey';
import {
  surveySchemaSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer';

export const SurveyActions = () => {
  const {deleteSurveyProps, duplicateSurveyProps} = useSurveyActions();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuItem
            onSelect={duplicateSurveyProps.handleDuplicateSurvey}
            disabled={duplicateSurveyProps.isPending}
          >
            Duplicate survey
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => deleteSurveyProps.setOpen(true)}
            className="text-red-600"
            disabled={duplicateSurveyProps.isPending}
          >
            Delete survey
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={deleteSurveyProps.isOpen}
        onOpenChange={deleteSurveyProps.setOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              survey.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSurveyProps.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              disabled={deleteSurveyProps.isPending}
              variant="destructive"
              onClick={deleteSurveyProps.handleDeleteSurvey}
            >
              Delete
              {deleteSurveyProps.isPending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const useSurveyActions = () => {
  const {id} = useSurveyDesignerStore(surveySchemaSelector);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const {mutate: duplicateSurvey, isPending: isPendingDuplicate} =
    useDuplicateSurvey();
  const {mutate: deleteSurvey, isPending: isPendingDelete} = useDeleteSurvey();

  const handleDeleteSurvey = () => {
    deleteSurvey(
      {surveyId: id},
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
          router.push('/');
          router.refresh();
        },
      },
    );
  };

  const handleDuplicateSurvey = () => {
    duplicateSurvey(
      {surveyId: id},
      {
        onSuccess: ({survey: duplicatedSurvey}) => {
          toast({
            title: 'Survey duplicated',
            description: 'Your survey has been duplicated successfully.',
            variant: 'default',
          });
          router.push(`/editor/${duplicatedSurvey.id}/designer`);
          router.refresh();
        },
      },
    );
  };

  return {
    deleteSurveyProps: {
      isOpen: showDeleteDialog,
      setOpen: setShowDeleteDialog,
      handleDeleteSurvey,
      isPending: isPendingDelete,
    },
    duplicateSurveyProps: {
      handleDuplicateSurvey,
      isPending: isPendingDuplicate,
    },
  };
};
