'use client';

import React, {useState} from 'react';
import {Loader2} from 'lucide-react';
import {Dialog, DialogOverlay} from '@/components/ui/dialog';
import {createContext} from '@/lib/context';

export const DuplicatePreviousPopup = ({children}: React.PropsWithChildren) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogOverlay className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-base font-medium">Duplicating survey...</p>
          </div>
        </DialogOverlay>
      </Dialog>
      <DuplicatePreviousProvider value={{isOpen, setOpen}}>
        {children}
      </DuplicatePreviousProvider>
    </>
  );
};

type Context = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

const [DuplicatePreviousProvider, useDuplicatePreviousPopup] =
  createContext<Context>();

export {useDuplicatePreviousPopup};
