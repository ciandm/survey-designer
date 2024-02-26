import {useRef} from 'react';

export const useAwaitingRef = () => {
  return useRef<{
    resolve: () => void;
    reject: () => void;
  }>();
};
