'use client';

import {QuestionSettings} from './question-settings';
import {QuestionTypeSelect} from './question-type-select';

export const ConfigPanel = () => (
  <aside className="hidden bg-background lg:block">
    <QuestionTypeSelect />
    <QuestionSettings />
  </aside>
);
