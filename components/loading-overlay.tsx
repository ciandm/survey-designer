'use client';

import React, {useState} from 'react';
import {createContext} from '@/utils/context';
import {Dialog, DialogOverlay} from './ui/dialog';

type LoadingOverlayProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

export const LoadingOverlay = ({children, isOpen}: LoadingOverlayProps) => {
  return (
    <>
      <Dialog open={isOpen}>
        <DialogOverlay>{children}</DialogOverlay>
      </Dialog>
    </>
  );
};
