'use client';

import {
  useSurveyDescription,
  useSurveyFieldActions,
  useSurveyTitle,
} from '@/components/survey-schema-initiailiser';
import {ContentEditable} from './content-editable';

export const EditorHeader = () => {
  const title = useSurveyTitle();
  const description = useSurveyDescription();
  const {updateTitle, updateDescription} = useSurveyFieldActions();

  return (
    <header className="flex flex-col items-start gap-2 border-b p-4">
      <ContentEditable
        html={title}
        className="text-md font-semibold"
        onChange={(e) => updateTitle(e.target.value)}
      />
      <ContentEditable
        className="text-sm text-gray-500"
        placeholder="Description (optional)"
        html={description ?? ''}
        onChange={(e) => updateDescription(e.target.value)}
      />
    </header>
  );
};
