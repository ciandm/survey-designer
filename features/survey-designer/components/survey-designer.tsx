'use client';

import {Fragment, useRef} from 'react';
import {PlusIcon} from '@radix-ui/react-icons';
import {Button} from '@/components/ui/button';
import {QuestionProvider} from '@/features/survey-tool/components/question-provider';
import {cn} from '@/lib/utils';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useQuestionCrud} from '../hooks/use-question-crud';
import {useDesignerMode} from '../store/designer-mode';
import {updateQuestion, useSurveyQuestions} from '../store/survey-designer';
import {ContentEditable} from './content-editable';
import {SurveyPreviewer} from './survey-previewer';

export const SurveyDesigner = () => {
  const designerMode = useDesignerMode();
  const questions = useSurveyQuestions();
  const {handleCreateQuestion, handleDeleteQuestion, handleDuplicateQuestion} =
    useQuestionCrud();
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

  const itemsRef = useRef<HTMLDivElement[]>([]);

  if (designerMode === 'preview') {
    return <SurveyPreviewer />;
  }

  return (
    <div className="flex h-full flex-1 overflow-auto bg-muted">
      <section className="flex flex-1 flex-col p-6">
        <div className="m-auto flex w-full flex-col gap-4">
          {questions.map((question, index) => (
            <Fragment key={question.id}>
              <div
                onClick={() => setActiveQuestion(question.ref)}
                ref={(el) => (itemsRef.current[index] = el as HTMLDivElement)}
                className={cn(
                  'cursor-pointer rounded-lg border border-zinc-200 bg-card p-8 ring-ring ring-offset-2 transition-shadow hover:ring-2',
                  {
                    'ring-2': activeQuestion?.id === question.id,
                  },
                )}
              >
                <QuestionProvider
                  question={question}
                  questionNumber={index + 1}
                  totalQuestions={questions.length}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <p className="mb-2 text-sm text-muted-foreground">
                        Question {index + 1} of {questions.length}
                      </p>
                    </div>
                    <ContentEditable
                      className={cn('text-2xl font-medium', {
                        'text-muted-foreground': !question.text,
                        [`after:content-['*']`]:
                          question.validations.required && question.text,
                      })}
                      placeholder="Begin typing your question here..."
                      html={question.text ?? ''}
                      onChange={(e) =>
                        updateQuestion?.({
                          id: question.id,
                          text: e.target.value,
                        })
                      }
                    />
                    <ContentEditable
                      className="mt-2 text-muted-foreground"
                      placeholder="Description (optional)"
                      html={question.description ?? ''}
                      onChange={(e) => {
                        updateQuestion?.({
                          id: question.id,
                          description: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {question.type === 'multiple_choice' && (
                    <div className="mt-4 flex flex-col items-start">
                      <div className="flex w-full max-w-sm flex-col gap-2">
                        <span className="text-sm text-muted-foreground">
                          {question.properties.allow_multiple_selection
                            ? 'Pick one or more'
                            : 'Pick one'}
                        </span>
                        {question.properties.choices?.map((choice) => {
                          return (
                            <div
                              key={choice.id}
                              className="h-10 rounded-md border p-2"
                            >
                              {choice.value}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="gap mt-8 flex justify-between">
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateQuestion(question.id);
                        }}
                      >
                        Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </QuestionProvider>
              </div>
              {index !== questions.length - 1 && (
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-zinc-200" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateQuestion({index: index + 1})}
                  >
                    Add question
                    <PlusIcon className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="flex-1 border-t border-zinc-200" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};
