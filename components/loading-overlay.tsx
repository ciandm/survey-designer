'use client';

import React, {useState} from 'react';
import {useAwaitingRef} from '@/app/hooks/use-awaiting-ref';
import {createContext} from '@/lib/context';
import {Dialog, DialogOverlay} from './ui/dialog';

export const LoadingOverlay = ({children}: React.PropsWithChildren) => {
  const {isOpen, onClose, onOpen, options} = useLoadingOverlay();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay>{options?.content}</DialogOverlay>
      </Dialog>
      <LoadingOverlayProvider value={onOpen}>{children}</LoadingOverlayProvider>
    </>
  );
};

type LoadingOverlayOptions = {
  content: React.ReactNode;
  catchError?: boolean;
};

const useLoadingOverlay = () => {
  const [options, setOptions] = useState<LoadingOverlayOptions | null>(null);
  const awaitingPromiseRef = useAwaitingRef();

  const onOpen = async (options: LoadingOverlayOptions) => {
    setOptions(options);
    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = {resolve, reject};
    });
  };

  const onClose = () => {
    if (options?.catchError && awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
    setOptions(null);
  };

  const isOpen = options !== null;

  return {onOpen, onClose, isOpen, options};
};

type Context = (options: LoadingOverlayOptions) => Promise<void>;

const [LoadingOverlayProvider, useLoadingOverlayTrigger] =
  createContext<Context>();

export {useLoadingOverlayTrigger};
