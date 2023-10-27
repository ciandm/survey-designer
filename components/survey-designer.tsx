'use client';

import {cn} from '@/lib/utils';
import {setSelectedFieldId, useSelectedField} from '@/stores/selected-field.ts';
import {QuestionOptions} from './question-designer/components/question-options';
import {QuestionDesigner} from './question-designer/question-designer';
import {useSurveySchemaStore} from './survey-schema-initiailiser';

export const SurveyDesigner = () => {
  const fields = useSurveySchemaStore((state) => state.fields);
  const selectedField = useSelectedField();

  const field = fields.find((q) => q.id === selectedField?.id);

  if (!field) return null;

  return (
    <>
      <aside className="w-full max-w-[260px] border-r">
        <ul className="flex flex-col">
          {fields.map((field) => (
            <button
              onClick={() => setSelectedFieldId(field.id)}
              className={cn('flex p-3 text-left', {
                'bg-slate-100': field.id === selectedField?.id,
              })}
              key={field.id}
            >
              <li>{field.text}</li>
            </button>
          ))}
        </ul>
      </aside>
      <div className="flex w-full items-center justify-center bg-slate-50 p-12">
        {field && <QuestionDesigner field={field} />}
      </div>
      <aside className="w-[480px] border-l">
        <QuestionOptions />
      </aside>
    </>
  );
};
