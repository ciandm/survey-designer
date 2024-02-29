'use client';

import {
  useDesignerActions,
  useSurveySchema,
} from '@/survey-dashboard/_store/survey-designer-store';
import {ContentEditable} from './content-editable';

export const SurveyTitleEditor = () => {
  const schema = useSurveySchema();
  const {updateTitle, updateDescription} = useDesignerActions();

  if (schema.elements.length === 0) return null;

  return (
    <div className="flex flex-col items-start space-y-2 py-4">
      <ContentEditable
        placeholder="Untitled survey"
        onBlur={(e) => updateTitle(e.target.textContent ?? '')}
        value={schema.title ?? ''}
        className="text-xl font-medium"
        tagName="h1"
      />
      <ContentEditable
        placeholder="Description (optional)"
        onBlur={(e) => updateDescription(e.target.textContent ?? '')}
        value={schema.description ?? ''}
        className="text-base"
        tagName="p"
      />
    </div>
  );
};
