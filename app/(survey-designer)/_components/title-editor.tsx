'use client';

import {
  useDesignerActions,
  useSurveyModel,
} from '@/survey-designer/_store/survey-designer-store';
import {setActiveElementRef} from '../_store/active-element-ref';

export const TitleEditor = () => {
  const model = useSurveyModel();
  const {updateTitle, updateDescription} = useDesignerActions();

  return (
    <div className="flex flex-col items-start space-y-2 py-4 pr-12">
      <div
        className="w-full overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => setActiveElementRef(null)}
      >
        <label htmlFor="survey-title" className="sr-only">
          Survey title
        </label>
        <input
          key={`${model.title}-survey-title`}
          type="text"
          name="survey-title"
          id="survey-title"
          className="block w-full border-0 bg-transparent px-2.5 pt-1 text-xl font-semibold outline-none placeholder:text-gray-400 focus:ring-0"
          placeholder="Untitled survey"
          defaultValue={model.title}
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
          key={`${model.description}-survey-description`}
          name="description"
          id="description"
          className="block w-full resize-none border-0 bg-transparent px-2.5 py-0 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Description (optional)"
          defaultValue={model.description}
          onBlur={(e) => updateDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        />
      </div>
    </div>
  );
};
