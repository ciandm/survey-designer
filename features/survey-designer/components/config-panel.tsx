'use client';

import React from 'react';
import {
  QuestionSettings,
  QuestionTypeOption,
} from '@/components/question-designer/components/question-options';

export const ConfigPanel = () => {
  return (
    <aside className="w-[480px] border-l">
      <QuestionTypeOption />
      <QuestionSettings />
    </aside>
  );
};
