'use client';

import {useEffect, useRef} from 'react';
import {Question} from '@/features/survey-tool/components/question';
import {QuestionProvider} from '@/features/survey-tool/components/question-provider';
import {ResponseField} from '@/features/survey-tool/components/response-field';
import {cn} from '@/lib/utils';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useDesignerMode} from '../store/designer-mode';
import {updateQuestion, useSurveyQuestions} from '../store/survey-designer';
import {ConfigPanel} from './config-panel';
import {EditorHeader} from './editor-header';
import {QuestionsSidebar} from './questions-sidebar';
import {SurveyPreviewer} from './survey-previewer';

export const SurveyDesigner = () => {
  const designerMode = useDesignerMode();
  const questions = useSurveyQuestions();
  const {activeQuestion, setActiveQuestion} = useActiveQuestion({
    onActiveQuestionChange: (ref) => {
      const index = questions.findIndex((question) => question.ref === ref);

      if (index !== -1) {
        itemsRef.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  if (designerMode === 'preview') {
    return <SurveyPreviewer />;
  }

  return (
    <>
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <QuestionsSidebar />
        <section className="flex h-full flex-1 flex-col overflow-y-auto bg-muted p-8">
          <div className="flex flex-col gap-6" ref={containerRef}>
            {questions.map((question, index) => (
              <div
                onClick={() => setActiveQuestion(question.ref)}
                ref={(el) => (itemsRef.current[index] = el as HTMLDivElement)}
                key={question.id}
                className={cn('rounded-md border border-zinc-200 bg-card p-8', {
                  'ring-2 ring-ring ring-offset-2':
                    activeQuestion?.id === question.id,
                })}
              >
                <QuestionProvider
                  question={question}
                  questionNumber={index + 1}
                  totalQuestions={questions.length}
                  view="editing"
                >
                  <Question
                    onTitleChange={(value) =>
                      updateQuestion({id: question.id, text: value})
                    }
                    onDescriptionChange={(value) =>
                      updateQuestion({id: question.id, description: value})
                    }
                  />
                  <ResponseField />
                </QuestionProvider>
              </div>
            ))}
          </div>
        </section>
        <ConfigPanel />
      </div>
    </>
  );
};
