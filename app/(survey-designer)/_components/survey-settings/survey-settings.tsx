'use client';

import React from 'react';
import {ElementSchemaType, ScreenSchemaType} from '@/types/element';
import {getIsElementSchema} from '@/utils/survey';
import {GeneralSettings} from './components/general-settings';
import {QuestionSettings} from './components/question-settings';

type Props = {
  element: ElementSchemaType | ScreenSchemaType | null;
};

export const SurveySettings = ({element}: Props) => {
  if (!element) return <GeneralSettings />;

  // Trigger a re-render when the active element changes
  const key = `${element?.id}-${element?.type}`;

  return (
    <React.Fragment key={key}>
      {getIsElementSchema(element) && <QuestionSettings element={element} />}
    </React.Fragment>
  );
};
