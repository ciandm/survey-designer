'use client';

import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import {Loader2} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {DeleteSurveyDialog} from '@/components/delete-survey-dialog';
import {DuplicateSurveyDialog} from '@/components/duplicate-survey-dialog/duplicate-survey-dialog';
import {Button} from '@/components/ui';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui';
import {useSurveyDialog} from '@/features/survey-designer/hooks/use-survey-dialog';
import {
  useDesignerStoreIsPublished,
  useDesignerStoreSurvey,
} from '@/features/survey-designer/store/designer-store';
import {cn} from '@/utils/classnames';
import {getSiteUrl} from '@/utils/hrefs';
import {CopySurveyUrl} from '../copy-survey-url';
import {useSurveyActions} from './use-survey-actions';

const actionClassName =
  'bg-transparent text-white hover:bg-blue-800/20 hover:text-white';

export const SurveyActions = () => {
  const survey = useDesignerStoreSurvey();
  const isPublished = useDesignerStoreIsPublished();
  const router = useRouter();
  const {
    state: {deleteDialogOptions, duplicateDialogOptions},
    handleOpenChange,
    handleTriggerDeleteDialog,
    handleTriggerDuplicateDialog,
  } = useSurveyDialog();
  const {saveSurvey, publishSurvey} = useSurveyActions();

  const shareSurveyDescription = isPublished
    ? 'Copy the link below to share your survey.'
    : 'You must publish your survey before you can share it.';

  const handleOnDeleteSuccess = () => {
    router.push(getSiteUrl.dashboardPage());
    router.refresh();
  };

  return (
    <>
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant="ghost"
          className={cn('hidden  sm:flex', actionClassName)}
          onClick={saveSurvey.handleClickSave}
          disabled={saveSurvey.status === 'executing'}
        >
          Save changes
          {saveSurvey.status === 'executing' && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          )}
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
            <div className={cn('space-y-1', isPublished && 'mb-4')}>
              <h3 className="text-base font-medium">Share your survey</h3>
              <p className="text-sm text-muted-foreground">
                {shareSurveyDescription}
              </p>
            </div>
            {isPublished && <CopySurveyUrl />}
          </PopoverContent>
        </Popover>

        <Button
          size="sm"
          variant="ghost"
          className={cn('hidden  sm:flex', actionClassName)}
          disabled={publishSurvey.status === 'executing'}
          onClick={(e) => {
            e.preventDefault();
            publishSurvey.handlePublishSurvey({
              surveyId: survey.id,
              action: isPublished ? 'unpublish' : 'publish',
            });
          }}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
          {publishSurvey.status === 'executing' && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          )}
        </Button>

        <Drawer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={actionClassName} size="sm">
                <span className="sr-only">Actions</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuItem
                className="sm:hidden"
                onSelect={(e) => {
                  e.preventDefault();
                  saveSurvey.handleClickSave();
                }}
                disabled={saveSurvey.status === 'executing'}
              >
                Save changes
                {saveSurvey.status === 'executing' && (
                  <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="sm:hidden" />
              <DrawerTrigger asChild>
                <DropdownMenuItem className="sm:hidden">Share</DropdownMenuItem>
              </DrawerTrigger>
              <DropdownMenuItem
                className="sm:hidden"
                disabled={publishSurvey.status === 'executing'}
                onSelect={(e) => {
                  e.preventDefault();
                  publishSurvey.handlePublishSurvey({
                    surveyId: survey.id,
                    action: isPublished ? 'unpublish' : 'publish',
                  });
                }}
              >
                {isPublished ? 'Unpublish' : 'Publish'}
                {publishSurvey.status === 'executing' && (
                  <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  handleTriggerDuplicateDialog({
                    id: survey.id,
                    title: survey.title ?? '',
                    description: survey.description,
                  })
                }
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() =>
                  handleTriggerDeleteDialog({
                    id: survey.id,
                    title: survey.title ?? '',
                  })
                }
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      </div>
      <DuplicateSurveyDialog
        id={survey.id}
        key={duplicateDialogOptions.data?.id}
        isOpen={duplicateDialogOptions.isOpen}
        onOpenChange={(isOpen) => handleOpenChange(isOpen, 'duplicate')}
        initialData={duplicateDialogOptions.data ?? {}}
      />
      <DeleteSurveyDialog
        key={deleteDialogOptions.data?.id}
        id={deleteDialogOptions.data?.id ?? ''}
        isOpen={deleteDialogOptions.isOpen}
        onOpenChange={(isOpen) => handleOpenChange(isOpen, 'delete')}
        onSuccess={handleOnDeleteSuccess}
      />
    </>
  );
};
