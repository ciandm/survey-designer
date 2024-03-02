'use client';
import {useState} from 'react';
import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {useDeleteSurveyDialogTrigger} from '@/components/delete-survey-dialog';
import {useDuplicateSurveyFormTrigger} from '@/components/duplicate-survey-dialog';
import {useLoadingOverlayTrigger} from '@/components/loading-overlay';
import {Button} from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {getSiteUrl} from '@/lib/hrefs';
import {updateModelAction} from '../_actions/update-model';
import {
  useIsSurveyChanged,
  useSurveyId,
  useSurveyModel,
  useSurveyPublished,
} from '../_store/survey-designer-store';
import {CopySurveyUrl} from './copy-survey-url';
import {usePublishTrigger} from './publish-dialog';

export const SurveyActions = () => {
  const isPublished = useSurveyPublished();
  const isChangesMade = useIsSurveyChanged();
  const {saveChanges, deleteSurvey, duplicateSurvey, publishSurvey} =
    useActions();

  const publishPopoverDescription = isPublished
    ? 'Copy the link below to share your survey.'
    : 'You must publish your survey before sharing it.';

  return (
    <div className="flex space-x-1">
      <Button
        size="sm"
        variant="secondary"
        onClick={saveChanges.handleClickSave}
        disabled={saveChanges.status === 'executing' || !isChangesMade}
      >
        Save
      </Button>

      <Popover modal>
        <PopoverTrigger asChild>
          <Button size="sm" variant="secondary" className="hidden sm:flex">
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="right-0 w-[480px]">
          <div className="mb-4 space-y-1">
            <h3 className="text-base font-medium">Share survey</h3>
            <p className="text-sm text-muted-foreground">
              {publishPopoverDescription}
            </p>
          </div>
          {isPublished && <CopySurveyUrl />}
        </PopoverContent>
      </Popover>
      <Drawer
        open={publishSurvey.isOpen}
        onOpenChange={publishSurvey.setIsOpen}
        shouldScaleBackground
      >
        <DrawerTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="flex sm:hidden"
            onClick={() => publishSurvey.setIsOpen(true)}
          >
            Share
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Share</DrawerTitle>
            <DrawerDescription>{publishPopoverDescription}</DrawerDescription>
          </DrawerHeader>
          {isPublished && (
            <DrawerFooter className="pt-0">
              <CopySurveyUrl />
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>

      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          publishSurvey.handleTriggerPublishDialog(
            isPublished ? 'unpublish' : 'publish',
          )
        }
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuItem
            onSelect={duplicateSurvey.handleClickDuplicateSurvey}
          >
            Duplicate survey
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onSelect={deleteSurvey.handleClickDeleteSurvey}
          >
            Delete survey
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const useActions = () => {
  const model = useSurveyModel();
  const id = useSurveyId();
  const {handleTriggerDuplicateSurveyDialog} = useDuplicateSurveyFormTrigger();
  const {handleTriggerDeleteSurveyConfirm} = useDeleteSurveyDialogTrigger();
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const {handleTriggerPublishDialog} = usePublishTrigger();
  const router = useRouter();
  const {handleHideOverlay, handleOpenOverlay} = useLoadingOverlayTrigger();

  const {execute: handleSaveSchema, status} = useAction(updateModelAction, {
    onSuccess: () => {
      handleHideOverlay();
      toast('Survey saved', {
        description: 'Your survey has been saved successfully.',
        action: {
          label: 'View',
          onClick: () => {
            window.open(`/survey/${id}`);
          },
        },
      });
    },
  });

  const handleClickSave = () => {
    handleOpenOverlay({
      content: (
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Saving survey...</p>
        </div>
      ),
    });
    handleSaveSchema({id, model});
  };

  const handleClickDeleteSurvey = async () => {
    handleTriggerDeleteSurveyConfirm({surveyId: id}).then(() => {
      router.push(getSiteUrl.dashboardPage());
      router.refresh();
    });
  };

  const handleClickDuplicateSurvey = () => {
    const initialData = {
      id,
      title: model.title,
      description: model.description,
    };
    handleTriggerDuplicateSurveyDialog({
      initialData,
    });
  };

  return {
    saveChanges: {
      handleClickSave,
      status,
    },
    deleteSurvey: {
      handleClickDeleteSurvey,
    },
    duplicateSurvey: {
      handleClickDuplicateSurvey,
    },
    publishSurvey: {
      handleTriggerPublishDialog,
      isOpen: isPublishDialogOpen,
      setIsOpen: setIsPublishDialogOpen,
    },
  };
};
