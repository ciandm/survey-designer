'use client';

import React from 'react';
import {CheckIcon} from '@radix-ui/react-icons';
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
import {createContext} from '@/lib/context';
import {usePublishDialog} from '@/survey-designer/_hooks/use-publish-dialog';
import {CopySurveyUrl} from './copy-survey-url';

export const PublishDialog = ({children}: {children: React.ReactNode}) => {
  const {
    handleTriggerPublishDialog,
    handleOnOpenChange,
    status,
    action,
    isOpen,
    handleRetry,
  } = usePublishDialog();

  return (
    <PublishDialogProvider value={{handleTriggerPublishDialog}}>
      {children}
      <Dialog
        open={isOpen}
        onOpenChange={status === 'executing' ? undefined : handleOnOpenChange}
      >
        <DialogContent hideCloseButton={status === 'executing'}>
          {status === 'executing' && (
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
          {status === 'hasSucceeded' && (
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
          {status === 'hasErrored' && (
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
                <Button onClick={handleRetry} size="sm" variant="secondary">
                  Retry
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PublishDialogProvider>
  );
};

type Context = {
  handleTriggerPublishDialog: (action: 'publish' | 'unpublish') => void;
};

const [PublishDialogProvider, usePublishTrigger] = createContext<Context>();

export {usePublishTrigger};
