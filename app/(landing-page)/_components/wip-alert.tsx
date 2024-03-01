'use client';

import {useEffect} from 'react';
import {toast} from 'sonner';

const TOAST_DURATION = 10000;
const TOAST_DELAY = 250;

export const WipAlert = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      toast('Please note', {
        description:
          'This is a demo version of the survey editor. Any changes you make will not be saved. It is also a work in progress. There may be bugs or other issues.',
        closeButton: true,
        duration: TOAST_DURATION,
        position: 'bottom-left',
      });
    }, TOAST_DELAY);

    return () => clearTimeout(timeout);
  }, []);

  return null;
};
