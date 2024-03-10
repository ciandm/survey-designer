'use client';

import {useActiveElement} from '../../_hooks/use-active-element';
import {ElementListProps} from '../element-list';
import {Footer} from './footer';
import {QuestionEditor} from './question-editor';

export type ElementEditorProps = Pick<ElementListProps, 'onSettingsClick'> & {};

export const ElementEditor = ({onSettingsClick}: ElementEditorProps) => {
  const {activeElement, activeElementIndex} = useActiveElement();

  return (
    <div className="group flex flex-1 cursor-pointer flex-col overflow-hidden shadow-sm ring-ring ring-offset-2 transition-colors">
      <div className="flex flex-1 flex-col gap-6 px-6 pb-2 pt-4">
        <QuestionEditor element={activeElement} index={activeElementIndex} />
      </div>
      <Footer
        element={activeElement}
        onSettingsClick={onSettingsClick}
        index={activeElementIndex}
      />
    </div>
  );
};
