'use client';

import React from 'react';
import {QuestionSettings} from './question-settings';
import {QuestionTypeSelect} from './question-type-select';

export const ConfigPanel = () => {
  return (
    <aside className="w-[480px] border-l bg-background">
      <QuestionTypeSelect />
      <QuestionSettings />
    </aside>
  );
};
