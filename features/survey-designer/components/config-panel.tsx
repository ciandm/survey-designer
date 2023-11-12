'use client';

import {QuestionSettings} from './question-settings';
import {QuestionTypeSelect} from './question-type-select';

export const ConfigPanel = () => (
  <aside className="hidden w-[400px] border-l bg-background md:block">
    <QuestionTypeSelect />
    <QuestionSettings />
  </aside>
);
