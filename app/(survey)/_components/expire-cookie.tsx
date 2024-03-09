'use client';

import React, {useEffect} from 'react';
import {expireCookieAction} from '../survey/_actions/expire-cookie-action';

type ExpireCookieProps = {
  surveyId: string;
  children: React.ReactNode;
};

export const ExpireCookie = ({surveyId, children}: ExpireCookieProps) => {
  useEffect(() => {
    expireCookieAction({surveyId});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};
