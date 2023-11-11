'use client';

import {QuestionSettings} from './question-settings';
import {QuestionTypeSelect} from './question-type-select';

export const ConfigPanel = () => (
  <aside className="w-[400px] border-l bg-background">
    <QuestionTypeSelect />
    <QuestionSettings />
  </aside>
);
