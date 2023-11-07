'use client';

import {Button} from '@/components/ui/button';
import {useSurveyFieldActions, useSurveyTitle} from '@/stores/survey-schema';
import {ContentEditable} from './content-editable';

export const EditorHeader = () => {
  const title = useSurveyTitle();
  const {updateTitle} = useSurveyFieldActions();

  return (
    <header className="flex items-center justify-between gap-2 border-b bg-background p-4">
      <div className="flex flex-col gap-1">
        <ContentEditable
          html={title}
          className="text-md font-semibold"
          placeholder="Untitled Survey"
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => alert('TODO: Preview')}>
          Preview
        </Button>
        <Button onClick={() => alert('TODO: Publish')}>Publish</Button>
      </div>
    </header>
  );
};
