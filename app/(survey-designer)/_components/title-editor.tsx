'use client';

import {
  useDesignerActions,
  useSurveySchema,
} from '@/survey-designer/_store/survey-designer-store';
import {setActiveElementRef} from '../_store/active-element-ref';

export const TitleEditor = () => {
  const schema = useSurveySchema();
  const {updateTitle, updateDescription} = useDesignerActions();

  if (schema.elements.length === 0) return null;

  return (
    <div
      className="w-full overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={() => setActiveElementRef(null)}
    >
      <label htmlFor="survey-title" className="sr-only">
        Survey title
      </label>
      <input
        key={schema.title}
        type="text"
        name="survey-title"
        id="survey-title"
        className="block w-full border-0 bg-transparent px-2.5 pt-1 text-xl font-semibold outline-none placeholder:text-gray-400 focus:ring-0"
        placeholder="Untitled survey"
        defaultValue={schema.title}
        onBlur={(e) => updateTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      />
      <label htmlFor="description" className="sr-only">
        Description
      </label>
      <textarea
        key={schema.description}
        name="description"
        id="description"
        className="block w-full resize-none border-0 bg-transparent px-2.5 py-0 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        placeholder="Description (optional)"
        defaultValue={schema.description}
        onBlur={(e) => updateDescription(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      />
    </div>
  );
};
