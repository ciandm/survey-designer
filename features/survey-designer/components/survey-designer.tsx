'use client';

import {Fragment, useRef} from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {PlusIcon} from '@radix-ui/react-icons';
import {CopyIcon, GripHorizontal, Trash2Icon} from 'lucide-react';
import {QuestionCard} from '@/components/question-card';
import {Sortable} from '@/components/sortable';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {useActiveQuestion} from '../hooks/use-active-question';
import {useQuestionCrud} from '../hooks/use-question-crud';
import {useDesignerMode} from '../store/designer-mode';
import {
  changeQuestionType,
  setQuestions,
  updateTitle,
  useSurveyQuestions,
  useSurveySchema,
} from '../store/survey-designer';
import {QuestionTypeSelect} from './question-type-select';
import {QuestionsEmptyState} from './questions-empty-state';
import {SurveyPreviewer} from './survey-previewer';

export const SurveyDesigner = () => {
  const designerMode = useDesignerMode();
  const questions = useSurveyQuestions();
  const {title} = useSurveySchema();
  const {handleCreateQuestion, handleDeleteQuestion, handleDuplicateQuestion} =
    useQuestionCrud();
  const {activeQuestion, setActiveQuestion} = useActiveQuestion();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemsRef = useRef<HTMLDivElement[]>([]);

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (active.id !== over?.id) {
      setQuestions((questions) => {
        const oldIndex = questions.findIndex((q) => q.id === active.id);
        const newIndex = questions.findIndex((q) => q.id === over?.id);

        return arrayMove(questions, oldIndex, newIndex);
      });
    }
  }

  if (designerMode === 'preview') {
    return <SurveyPreviewer />;
  }

  return (
    <>
      <section className="flex flex-1 flex-col items-start overflow-auto bg-accent p-6">
        <Textarea
          className="mb-8 text-xl font-medium"
          placeholder="Untitled survey"
          value={title ?? ''}
          onChange={(e) => updateTitle(e.target.value)}
        />
        {questions.length === 0 ? (
          <div className="mx-auto">
            <QuestionsEmptyState />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map((question) => question.id)}
                strategy={verticalListSortingStrategy}
              >
                {questions.map((question, index) => {
                  const isActive = activeQuestion?.id === question.id;
                  return (
                    <Sortable
                      key={question.id}
                      id={question.id}
                      className="flex w-full flex-1 items-center gap-2"
                      renderSortHandle={({
                        attributes,
                        listeners,
                        isSorting,
                      }) => (
                        <Button
                          size="icon"
                          variant="ghost"
                          {...attributes}
                          {...listeners}
                          className="flex items-center justify-center"
                        >
                          <GripHorizontal
                            className={cn(
                              'h-4 w-4 text-muted-foreground',
                              isSorting ? 'cursor-grabbing' : 'cursor-grab',
                            )}
                          />
                        </Button>
                      )}
                    >
                      <QuestionCard
                        question={question}
                        id={question.id}
                        number={index + 1}
                        isActive={isActive}
                        onClick={() => setActiveQuestion(question.ref)}
                        ref={(el) =>
                          (itemsRef.current[index] = el as HTMLDivElement)
                        }
                        isEditable
                        footer={
                          <footer className="bg-accent px-4 py-2">
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
                    </Sortable>
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
              </SortableContext>
            </DndContext>
          </div>
        )}
      </section>
    </>
  );
};
