import React from 'react';
import {EditorHeader} from './editor-header';
import {QuestionEditor} from './question-editor';

export const EditorSection = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <EditorHeader />
      <QuestionEditor />
      <footer className="border-t p-4">footer</footer>
    </div>
  );
};
