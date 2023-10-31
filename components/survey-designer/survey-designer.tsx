'use client';

import {useSelectedField} from '@/stores/selected-field.ts';
import {QuestionOptions} from '../question-designer/components/question-options';
import {QuestionDesigner} from '../question-designer/question-designer';
import {useSurveySchemaStore} from '../survey-schema-initiailiser';
import {QuestionSidebar} from './_components/question-sidebar';

export const SurveyDesigner = () => {
  const fields = useSurveySchemaStore((state) => state.fields);
  const selectedField = useSelectedField();

  const field = fields.find((q) => q.ref === selectedField?.ref);
  const selectedFieldIndex = fields.findIndex(
    (q) => q.ref === selectedField?.ref,
  );

  return (
    <>
      <QuestionSidebar />
      <div className="flex w-full items-center justify-center bg-slate-50 p-12">
        {field && (
          <QuestionDesigner index={selectedFieldIndex + 1} field={field} />
        )}
      </div>
      <aside className="w-[480px] border-l">
        <QuestionOptions />
      </aside>
    </>
  );
};
