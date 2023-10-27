'use client';

import {useIsMutating, useMutationState} from '@tanstack/react-query';
import {cn} from '@/lib/utils';
import {setSelectedFieldId, useSelectedField} from '@/stores/selected-field.ts';
import {QuestionOptions} from './question-designer/components/question-options';
import {QuestionDesigner} from './question-designer/question-designer';
import {
  useSurveySchemaActions,
  useSurveySchemaStore,
} from './survey-schema-initiailiser';

export const SurveyDesigner = () => {
  const {insertField, deleteField, duplicateField} = useSurveySchemaActions();
  const fields = useSurveySchemaStore((state) => state.fields);
  const selectedField = useSelectedField();
  const isMutating = useIsMutating({
    mutationKey: ['survey-schema'],
  });

  const field = fields.find((q) => q.ref === selectedField?.ref);
  const selectedFieldIndex = fields.findIndex(
    (q) => q.ref === selectedField?.ref,
  );

  if (!field) return null;

  return (
    <>
      <aside className="w-full max-w-[260px] border-r">
        <button
          onClick={() =>
            insertField({type: 'SHORT_TEXT', indexAt: selectedFieldIndex + 1})
          }
        >
          Add question
        </button>
        {!!isMutating && <p>loading...</p>}
        <ul className="flex flex-col">
          {fields.map((field) => (
            <div key={field.id} className="w-full">
              <button
                onClick={() => setSelectedFieldId(field.ref)}
                className={cn('flex p-3 text-left', {
                  'bg-slate-100': field.id === selectedField?.id,
                })}
              >
                <li>
                  <div>{field.type}</div>
                  <div>{field.text}</div>
                </li>
              </button>
              <div className="flex">
                <button
                  onClick={() =>
                    deleteField({
                      ref: field.ref,
                      fallbackSelectedField:
                        fields[selectedFieldIndex - 1]?.ref,
                    })
                  }
                  className={cn('flex p-3 text-left', {
                    'bg-slate-100': field.id === selectedField?.id,
                  })}
                >
                  Delete
                </button>
                <button
                  onClick={() => duplicateField({ref: field.ref})}
                  className={cn('flex p-3 text-left', {
                    'bg-slate-100': field.id === selectedField?.id,
                  })}
                >
                  Duplicate
                </button>
              </div>
            </div>
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
