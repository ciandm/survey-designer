'use client';

import {useDesignerMode} from '../store/designer-mode';
import {ConfigPanel} from './config-panel';
import {EditorHeader} from './editor-header';
import {EditorSection} from './editor-section';
import {QuestionEditor} from './question-editor';
import {QuestionsSidebar} from './questions-sidebar';
import {SurveyPreviewer} from './survey-previewer';

export const SurveyDesigner = () => {
  const designerMode = useDesignerMode();

  if (designerMode === 'preview') {
    return <SurveyPreviewer />;
  }

  return (
    <>
      <div className="flex w-full flex-1 flex-col">
        <EditorHeader />
        <div className="flex h-full flex-1 overflow-hidden">
          <QuestionsSidebar />
          <EditorSection>
            <QuestionEditor />
          </EditorSection>
          <ConfigPanel />
        </div>
      </div>
    </>
  );
};
