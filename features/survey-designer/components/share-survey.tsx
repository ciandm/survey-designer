'use client';

import {useState} from 'react';
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
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {useSurveyPublished} from '../store/survey-designer-store';
import {CopySurveyUrl} from './copy-survey-url';

export const ShareSurvey = () => {
  const isPublished = useSurveyPublished();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const description = isPublished
    ? 'Copy the link below to share your survey.'
    : 'You must publish your survey before sharing it.';

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="secondary" className="hidden sm:flex">
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="right-0 w-[480px]">
          <div className="mb-4 space-y-1">
            <h3 className="text-base font-medium">Share survey</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {isPublished && <CopySurveyUrl />}
        </PopoverContent>
      </Popover>
      <Drawer
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        shouldScaleBackground
      >
        <DrawerTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="flex sm:hidden"
            onClick={() => setIsDialogOpen(true)}
          >
            Share
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Share</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {isPublished && (
            <DrawerFooter className="pt-0">
              <CopySurveyUrl />
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
