import {ElementSchema, ScreenSchema} from '@/types/element';
import {
  getIsElementSchema,
  getIsElementType,
  getIsScreenSchema,
  getIsScreenType,
} from '@/utils/survey';
import {Footer} from './footer';
import {QuestionEditor} from './question-editor';

type ElementEditorProps = {
  element: ElementSchema | ScreenSchema | null;
};

export const ElementEditor = ({element}: ElementEditorProps) => {
  if (!element) return null;

  return (
    <>
      <div className="group flex flex-1 cursor-pointer flex-col shadow-sm ring-ring ring-offset-2 transition-colors">
        {getIsScreenSchema(element) && <h1>{element.id}</h1>}
        {getIsElementSchema(element) && (
          <QuestionEditor element={element}>
            <Footer element={element} />
          </QuestionEditor>
        )}
      </div>
    </>
  );
};
