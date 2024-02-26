'use client';

import React, {useState} from 'react';
import {createContext} from '@/lib/context';
import {Dialog, DialogOverlay} from './ui/dialog';

export const LoadingOverlay = ({children}: React.PropsWithChildren) => {
  const {isOpen, handleOpenOverlay, handleHideOverlay, options} =
    useLoadingOverlay();

  return (
    <>
      <Dialog open={isOpen}>
        <DialogOverlay>{options?.content}</DialogOverlay>
      </Dialog>
      <LoadingOverlayProvider value={{handleHideOverlay, handleOpenOverlay}}>
        {children}
      </LoadingOverlayProvider>
    </>
  );
};

type LoadingOverlayOptions = {
  content: React.ReactNode;
  catchError?: boolean;
};

const useLoadingOverlay = () => {
  const [options, setOptions] = useState<LoadingOverlayOptions | null>(null);

  const handleOpenOverlay = async (options: LoadingOverlayOptions) => {
    setOptions(options);
    return new Promise<void>((resolve) => {
      resolve();
    });
  };

  const handleHideOverlay = () => {
    setOptions(null);
  };

  const isOpen = options !== null;

  return {isOpen, options, handleOpenOverlay, handleHideOverlay};
};

type Context = {
  handleOpenOverlay: (options: LoadingOverlayOptions) => Promise<void>;
  handleHideOverlay: () => void;
};

const [LoadingOverlayProvider, useLoadingOverlayTrigger] =
  createContext<Context>();

export {useLoadingOverlayTrigger};
