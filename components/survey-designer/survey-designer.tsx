'use client';

import {
  QuestionSettings,
  QuestionTypeOption,
} from '../question-designer/components/question-options';
import {
  useActiveQuestion,
  useSurveyFieldActions,
} from '../survey-schema-initiailiser';
import {EditorSection} from './_components/editor-section';
import {QuestionsSidebar} from './_components/questions-sidebar';

export const SurveyDesigner = () => {
  const {activeQuestion} = useActiveQuestion();
  const {updateQuestion} = useSurveyFieldActions();

  return (
    <>
      <QuestionsSidebar />
      <EditorSection />
      {activeQuestion && (
        <aside
          className="w-[480px] border-l"
          key={activeQuestion ? activeQuestion.id : null}
        >
          <QuestionTypeOption />
          <QuestionSettings />
        </aside>
      )}
    </>
  );
};
