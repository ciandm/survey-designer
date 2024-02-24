'use client';

import {CheckIcon, ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {InfoIcon, Loader2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {usePublishSurvey} from '../hooks/use-publish-survey';
import {
  surveyPublishedSelector,
  useSurveyDesignerStore,
} from '../store/survey-designer';
import {CopySurveyUrl} from './copy-survey-url';

export const PublishDialog = () => {
  const isPublished = useSurveyDesignerStore(surveyPublishedSelector);
  const {action, handlePublish, handleOpenChange, isDialogOpen, status} =
    usePublishSurvey();

  return (
    <>
      <Button
        onClick={() => handlePublish(isPublished ? 'unpublish' : 'publish')}
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <Dialog
        open={isDialogOpen}
        onOpenChange={status === 'pending' ? undefined : handleOpenChange}
      >
        <DialogContent hideCloseButton={status === 'pending'}>
          {status === 'pending' && (
            <DialogHeader className="flex-row items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="space-y-0.5">
                <DialogTitle className="text-base">
                  {action === 'publish' ? 'Publishing' : 'Unpublishing'}{' '}
                  survey...
                </DialogTitle>
                <DialogDescription>
                  This may take a few seconds.
                </DialogDescription>
              </div>
            </DialogHeader>
          )}
          {status === 'success' && (
            <>
              <DialogHeader className="flex-row items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <div className="space-y-0.5">
                  <DialogTitle className="text-base">
                    {action === 'publish'
                      ? 'Survey published successfully!'
                      : 'Survey unpublished.'}
                  </DialogTitle>
                  <DialogDescription>
                    {action === 'publish'
                      ? 'Your survey is now live and available for responses.'
                      : 'Your survey is no longer available for responses.'}
                  </DialogDescription>
                </div>
              </DialogHeader>
              {action === 'publish' && <CopySurveyUrl />}
            </>
          )}
          {status === 'error' && (
            <>
              <DialogHeader className="flex-row items-center gap-2">
                <InfoIcon className="mt-2 h-5 w-5 self-start text-red-500" />
                <div className="space-y-0.5">
                  <DialogTitle className="text-base">
                    Error {action === 'publish' ? 'publishing' : 'unpublishing'}{' '}
                    survey
                  </DialogTitle>
                  <DialogDescription className="mb-4">
                    An error occurred while{' '}
                    {action === 'publish' ? 'publishing' : 'unpublishing'} your
                    survey. Please try again.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={() =>
                    handlePublish(isPublished ? 'unpublish' : 'publish')
                  }
                  size="sm"
                  variant="secondary"
                >
                  Retry
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
