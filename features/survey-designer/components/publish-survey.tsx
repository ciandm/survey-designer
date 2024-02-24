'use client';

import {CheckIcon} from '@radix-ui/react-icons';
import {Loader2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {usePublishSurvey} from '../hooks/use-publish-survey';
import {CopySurveyUrl} from './copy-survey-url';

export const PublishSurvey = () => {
  const {dialog, publish, isPublished} = usePublishSurvey();

  return (
    <>
      <Button
        onClick={() =>
          publish.handlePublish(isPublished ? 'unpublish' : 'publish')
        }
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <Dialog
        open={dialog.isOpen}
        onOpenChange={publish.pending ? undefined : dialog.handleOpenChange}
      >
        <DialogContent hideCloseButton={publish.pending}>
          {(publish.status === 'publishing' ||
            publish.status === 'unpublishing') && (
            <DialogHeader className="flex-row items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="space-y-0.5">
                <DialogTitle className="text-base">
                  {publish.status === 'publishing'
                    ? 'Publishing'
                    : 'Unpublishing'}{' '}
                  survey...
                </DialogTitle>
                <DialogDescription>
                  This may take a few seconds.
                </DialogDescription>
              </div>
            </DialogHeader>
          )}
          {publish.success && (
            <>
              {publish.status === 'published' ? (
                <>
                  <DialogHeader className="flex-row items-center gap-2">
                    <CheckIcon className="h-8 w-8 text-green-500" />
                    <div className="space-y-0.5">
                      <DialogTitle className="text-base">
                        Survey published successfully!
                      </DialogTitle>
                      <DialogDescription>
                        Your survey is now live and available for responses.
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  <CopySurveyUrl />
                </>
              ) : (
                <DialogHeader className="flex-row items-center gap-2">
                  <CheckIcon className="h-8 w-8 text-green-500" />
                  <div className="space-y-0.5">
                    <DialogTitle className="text-base">
                      Survey unpublished.
                    </DialogTitle>
                    <DialogDescription>
                      Your survey is no longer available for responses.
                    </DialogDescription>
                  </div>
                </DialogHeader>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
