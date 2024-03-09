'use client';

import React from 'react';
import {useActiveElement} from '@/survey-designer/_hooks/use-active-element';
import {GeneralSettings} from './components/general-settings';
import {QuestionSettings} from './components/question-settings';

export const SurveySettings = () => {
  const {activeElement} = useActiveElement();

  if (!activeElement) return <GeneralSettings />;

  // Trigger a re-render when the active element changes
  const key = `${activeElement?.id}-${activeElement?.type}`;

  return (
    <React.Fragment key={key}>
      <QuestionSettings element={activeElement} />
    </React.Fragment>
  );
};
