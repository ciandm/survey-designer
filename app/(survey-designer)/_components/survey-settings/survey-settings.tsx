'use client';

import React from 'react';
import {ElementSchema, ScreenSchema} from '@/types/element';
import {getIsElementSchema, getIsScreenSchema} from '@/utils/survey';
import {GeneralSettings} from './components/general-settings';
import {QuestionSettings} from './components/question-settings';
import {ScreenSettings} from './components/screen-settings';

type Props = {
  element: ElementSchema | ScreenSchema | null;
};

export const SurveySettings = ({element}: Props) => {
  if (!element) return <GeneralSettings />;

  // Trigger a re-render when the active element changes
  const key = `${element?.id}-${element?.type}`;

  return (
    <React.Fragment key={key}>
      {getIsScreenSchema(element) && <ScreenSettings element={element} />}
      {getIsElementSchema(element) && <QuestionSettings element={element} />}
    </React.Fragment>
  );
};
