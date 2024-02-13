'use client';

import {Fragment, useRef} from 'react';
import {PlusIcon} from '@radix-ui/react-icons';
import {CopyIcon, GripHorizontal, Trash2Icon} from 'lucide-react';
import {QuestionCard} from '@/components/question-card';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useQuestionCrud} from '../hooks/use-question-crud';
import {useDesignerMode} from '../store/designer-mode';
import {
  changeQuestionType,
  updateTitle,
  useSurveyQuestions,
  useSurveySchema,
} from '../store/survey-designer';
import {QuestionTypeSelect} from './question-type-select';
import {SurveyPreviewer} from './survey-previewer';

export const SurveyDesigner = () => {
  const designerMode = useDesignerMode();
  const questions = useSurveyQuestions();
  const {title} = useSurveySchema();
  const {handleCreateQuestion, handleDeleteQuestion, handleDuplicateQuestion} =
    useQuestionCrud();
  const {activeQuestion, setActiveQuestion} = useActiveQuestion({
    // onActiveQuestionChange: (ref) => {
    //   const index = questions.findIndex((question) => question.ref === ref);
    //   if (index !== -1) {
    //     itemsRef.current[index]?.scrollIntoView({
    //       block: 'center',
    //     });
    //   }
    // },
  });

  const itemsRef = useRef<HTMLDivElement[]>([]);

  if (designerMode === 'preview') {
    return <SurveyPreviewer />;
  }

  return (
    <>
      <section className="flex flex-1 flex-col items-start overflow-auto p-6">
        <Textarea
          className="mb-8 text-xl font-medium"
          placeholder="Untitled survey"
          value={title ?? ''}
          onChange={(e) => updateTitle(e.target.value)}
        />
        <div className="flex w-full flex-col gap-4">
          {questions.length === 0 && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">
                No questions yet. Click the button below to add a question.
              </p>
              <Button
                onClick={() => handleCreateQuestion({index: 0})}
                variant="outline"
              >
                Add question
              </Button>
            </div>
          )}
          {questions.map((question, index) => {
            const isActive = activeQuestion?.id === question.id;
            return (
              <Fragment key={question.id}>
                <QuestionCard
                  question={question}
                  id={question.id}
                  number={index + 1}
                  isActive={isActive}
                  onClick={() => setActiveQuestion(question.ref)}
                  ref={(el) => (itemsRef.current[index] = el as HTMLDivElement)}
                  isEditable
                  header={
                    <header className="flex items-center justify-center pt-3">
                      <GripHorizontal className="h-4 w-4 cursor-grab text-muted-foreground" />
                    </header>
                  }
                  footer={
                    <footer className="border-t bg-muted px-4 py-2">
                      <div className="grid grid-cols-[200px_1fr] justify-items-end">
                        <QuestionTypeSelect
                          className="h-9 border-0 bg-transparent text-sm font-medium text-muted-foreground"
                          question={question}
                          onChange={(type) =>
                            changeQuestionType({
                              id: question.id,
                              type,
                            })
                          }
                          onOpenChange={(open) =>
                            open && setActiveQuestion(question.ref)
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateQuestion(question.id);
                            }}
                          >
                            <CopyIcon className="mr-2 h-4 w-4" />
                            Duplicate
                          </Button>
                          <Button
                            className="text-muted-foreground"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(question.id);
                            }}
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </footer>
                  }
                />
              </Fragment>
            );
          })}
          {questions.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-zinc-200" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCreateQuestion()}
              >
                Add question
                <PlusIcon className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex-1 border-t border-zinc-200" />
            </div>
          )}
        </div>
      </section>
    </>
  );
};
