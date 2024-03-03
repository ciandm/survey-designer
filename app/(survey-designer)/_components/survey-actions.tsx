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
import {cn} from '@/lib/utils';
import {updateModelAction} from '../_actions/update-model';
import {
  useIsSurveyChanged,
  useSurveyId,
  useSurveyModel,
  useSurveyPublished,
} from '../_store/survey-designer-store';
import {CopySurveyUrl} from './copy-survey-url';
import {usePublishTrigger} from './publish-dialog';

const actionClassName =
  'bg-transparent text-white hover:bg-blue-800/20 hover:text-white';

export const SurveyActions = () => {
  const isChangesMade = useIsSurveyChanged();
  const isPublished = useSurveyPublished();
  const {
    handleClickDeleteSurvey,
    handleClickDuplicateSurvey,
    handleClickSave,
    handleClickShareSurvey,
    handleTriggerPublishDialog,
    handleShareSurveyDrawerOpenChange,
    isShareDrawerOpen,
    saveSchemaStatus,
  } = useActions();

  const shareSurveyDescription = isPublished
    ? 'Copy the link below to share your survey.'
    : 'You must publish your survey before you can share it.';

  const shareSurveyContent = (
    <>
      <div className={cn('space-y-1', isPublished && 'mb-4')}>
        <h3 className="text-base font-medium">Share your survey</h3>
        <p className="text-sm text-muted-foreground">
          {shareSurveyDescription}
        </p>
      </div>
      {isPublished && <CopySurveyUrl />}
    </>
  );

  return (
    <div className="flex space-x-1">
      <Button
        size="sm"
        variant="ghost"
        className={cn('hidden  sm:flex', actionClassName)}
        onClick={handleClickSave}
        disabled={saveSchemaStatus === 'executing' || !isChangesMade}
      >
        Save changes
      </Button>

      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className={cn('hidden  sm:flex', actionClassName)}
          >
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className={isPublished ? 'right-0 w-[480px]' : ''}>
          {shareSurveyContent}
        </PopoverContent>
      </Popover>

      <Button
        size="sm"
        variant="ghost"
        className={cn('hidden  sm:flex', actionClassName)}
        onClick={() =>
          handleTriggerPublishDialog(isPublished ? 'unpublish' : 'publish')
        }
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={actionClassName} size="sm">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuItem
            disabled={!isChangesMade}
            className="sm:hidden"
            onSelect={() => handleClickSave()}
          >
            Save changes
          </DropdownMenuItem>
          <DropdownMenuSeparator className="sm:hidden" />
          <Drawer
            open={isShareDrawerOpen}
            onOpenChange={handleShareSurveyDrawerOpenChange}
            shouldScaleBackground
          >
            <DrawerTrigger asChild>
              <DropdownMenuItem
                className="sm:hidden"
                onSelect={handleClickShareSurvey}
              >
                Share
              </DropdownMenuItem>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Share</DrawerTitle>
                <DrawerDescription>{shareSurveyDescription}</DrawerDescription>
              </DrawerHeader>
              {isPublished && (
                <DrawerFooter className="pt-0">
                  <CopySurveyUrl />
                </DrawerFooter>
              )}
            </DrawerContent>
          </Drawer>
          <DropdownMenuItem
            className="sm:hidden"
            onSelect={() =>
              handleTriggerPublishDialog(isPublished ? 'unpublish' : 'publish')
            }
          >
            Publish
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleClickDuplicateSurvey}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onSelect={handleClickDeleteSurvey}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const useActions = () => {
  const model = useSurveyModel();
  const id = useSurveyId();
  const router = useRouter();
  const isPublished = useSurveyPublished();
  const {handleTriggerDuplicateSurveyDialog} = useDuplicateSurveyFormTrigger();
  const {handleTriggerDeleteSurveyConfirm} = useDeleteSurveyDialogTrigger();
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
  const {handleTriggerPublishDialog} = usePublishTrigger();
  const {handleHideOverlay, handleOpenOverlay} = useLoadingOverlayTrigger();

  const {execute: handleSaveSchema, status: saveSchemaStatus} = useAction(
    updateModelAction,
    {
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
    },
  );

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

  const handleClickPublishSurvey = (e: Event) => {
    e.preventDefault();
    handleTriggerPublishDialog(isPublished ? 'unpublish' : 'publish');
  };

  const handleClickShareSurvey = (e: Event) => {
    e.preventDefault();
    setIsShareDrawerOpen(true);
  };

  const handleShareSurveyDrawerOpenChange = (open: boolean) => {
    setIsShareDrawerOpen(open);
  };

  return {
    saveSchemaStatus,
    handleClickSave,
    handleClickPublishSurvey,
    handleClickDeleteSurvey,
    handleClickDuplicateSurvey,
    handleTriggerPublishDialog,
    handleClickShareSurvey,
    handleShareSurveyDrawerOpenChange,
    isShareDrawerOpen,
  };
};
