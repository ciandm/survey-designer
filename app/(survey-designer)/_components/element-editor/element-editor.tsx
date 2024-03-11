import {ElementSchema, ScreenSchema} from '@/types/element';
import {getIsElementSchema, getIsScreenSchema} from '@/utils/survey';
import {Footer} from './footer';
import {QuestionEditor} from './question-editor';
import {ScreenEditor} from './screen-editor';

type ElementEditorProps = {
  element: ElementSchema | ScreenSchema | null;
};

export const ElementEditor = ({element}: ElementEditorProps) => {
  if (!element) return null;

  return (
    <>
      <div className="flex flex-1 flex-col">
        {getIsScreenSchema(element) && <ScreenEditor element={element} />}
        {getIsElementSchema(element) && (
          <QuestionEditor element={element}>
            <Footer element={element} />
          </QuestionEditor>
        )}
      </div>
    </>
  );
};
