'use client';

import {useDesignerMode} from '../store/designer-mode';
import {ConfigPanel} from './config-panel';
import {EditorHeader} from './editor-header';
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
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <QuestionsSidebar />
        <section className="flex h-full flex-1 flex-col overflow-hidden">
          <QuestionEditor />
        </section>
        <ConfigPanel />
      </div>
    </>
  );
};
