'use client';

import {useState} from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import {
  DragHandleDots2Icon,
  EraserIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import {HelpCircleIcon, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {useActiveQuestion} from '../hooks/use-active-question';
import {
  changeQuestionType,
  deleteQuestionChoice,
  deleteQuestionChoices,
  insertQuestionChoice,
  moveQuestionChoices,
  updateQuestion,
  updateQuestionChoice,
} from '../store/survey-designer';
import {QuestionTypeSelect} from './question-type-select';

type Panel = 'question' | 'choices' | 'logic' | 'validation';

const SORT_ORDER_OPTIONS = [
  {label: 'None', value: 'none'},
  {label: 'Ascending', value: 'asc'},
  {label: 'Descending', value: 'desc'},
  {label: 'Random', value: 'random'},
] as const;

export const ConfigPanel = () => {
  const {activeQuestion} = useActiveQuestion();

  return (
    <ConfigPanelInner key={`${activeQuestion?.id}-${activeQuestion?.type}`} />
  );
};

const ConfigPanelInner = () => {
  const {activeQuestion} = useActiveQuestion();
  const [openPanel, setOpenPanel] = useState<Panel>('question');

  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const choices = activeQuestion?.properties.choices ?? [];

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (active.id !== over?.id && activeQuestion) {
      const choices = activeQuestion?.properties.choices ?? [];
      const oldIndex = choices.findIndex((choice) => choice.id === active.id);
      const newIndex = choices.findIndex((choice) => choice.id === over?.id);

      const newChoices = arrayMove(choices, oldIndex, newIndex);
      moveQuestionChoices({questionId: activeQuestion.id, newChoices});
    }
  }

  return (
    <aside className="hidden max-w-sm flex-1 flex-col overflow-auto border-l bg-white lg:flex">
      {activeQuestion ? (
        <>
          <Panel
            title="Question"
            isOpen={openPanel === 'question'}
            onClick={() => setOpenPanel('question')}
          >
            <div>
              <Label htmlFor="question-type">Type</Label>
              <QuestionTypeSelect
                question={activeQuestion}
                onChange={(type) =>
                  changeQuestionType({
                    id: activeQuestion.id,
                    type,
                  })
                }
                id="question-type"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Textarea
                name="title"
                id="title"
                value={activeQuestion.text}
                onChange={(e) =>
                  updateQuestion({
                    id: activeQuestion.id,
                    text: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                name="description"
                id="description"
                value={activeQuestion.description}
                onChange={(e) =>
                  updateQuestion({
                    id: activeQuestion.id,
                    description: e.target.value,
                  })
                }
              />
            </div>
            {(activeQuestion.type === 'short_text' ||
              activeQuestion.type === 'long_text') && (
              <div>
                <Label htmlFor="placeholder">Placeholder (optional)</Label>
                <Textarea
                  name="placeholder"
                  id="placeholder"
                  value={activeQuestion.properties.placeholder}
                  onChange={(e) =>
                    updateQuestion({
                      id: activeQuestion.id,
                      properties: {
                        placeholder: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="flex items-center">
                <Checkbox
                  className="mr-2"
                  onCheckedChange={(checked) => {
                    updateQuestion({
                      id: activeQuestion.id,
                      validations: {
                        required: !!checked,
                      },
                    });
                  }}
                  checked={activeQuestion.validations.required}
                />
                <span>Make this question required</span>
              </label>
              {activeQuestion.validations.required && (
                <>
                  <div className="mt-2 flex items-center justify-between">
                    <Label htmlFor="required">Required error message</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <HelpCircleIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="left">
                        <p className="text-xs leading-snug">
                          If the question is required, this message will be
                          shown if the user tries to submit the form without
                          answering this question. Defaults to &quot;This field
                          is required&quot;.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Textarea
                    name="required"
                    id="required"
                    value={activeQuestion.properties.required_message}
                    onChange={(e) =>
                      updateQuestion({
                        id: activeQuestion.id,
                        properties: {
                          required_message: e.target.value,
                        },
                      })
                    }
                  />
                </>
              )}
            </div>
          </Panel>
          {activeQuestion.type === 'multiple_choice' && (
            <Panel
              title="Choices"
              isOpen={openPanel === 'choices'}
              onClick={() => setOpenPanel('choices')}
            >
              <div>
                <div className="mb-2 grid grid-cols-[1fr_40px_40px] items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">Choices</p>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      deleteQuestionChoices({questionId: activeQuestion.id})
                    }
                  >
                    <EraserIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      insertQuestionChoice({
                        questionId: activeQuestion.id,
                      })
                    }
                  >
                    <PlusCircledIcon className="h-5 w-5" />
                  </Button>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={choices.map((choice) => choice.id)}>
                    <div className="flex flex-col gap-1">
                      {(choices ?? []).map((choice) => (
                        <Sortable
                          className="grid grid-cols-[40px_1fr_40px] gap-2"
                          key={choice.id}
                          id={choice.id}
                          isDisabled={choices.length === 1}
                        >
                          <>
                            <Input
                              type="text"
                              value={choice.value}
                              onChange={(e) =>
                                updateQuestionChoice({
                                  questionId: activeQuestion.id,
                                  newChoice: {
                                    id: choice.id,
                                    value: e.target.value,
                                  },
                                })
                              }
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                deleteQuestionChoice({
                                  questionId: activeQuestion.id,
                                  choiceId: choice.id,
                                })
                              }
                              disabled={
                                activeQuestion.properties.choices?.length === 1
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        </Sortable>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
              <Separator />
              <div>
                <Label
                  htmlFor="sort-choices"
                  className="mb-1 text-sm font-medium"
                >
                  Sort choices
                </Label>
                <Select
                  value={activeQuestion.properties.sort_order ?? 'none'}
                  onValueChange={(value) => {
                    updateQuestion({
                      id: activeQuestion.id,
                      properties: {
                        sort_order:
                          value === 'none' ? undefined : (value as any),
                      },
                    });
                  }}
                >
                  <SelectTrigger id="sort-choices">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SORT_ORDER_OPTIONS.map((option) => (
                        <SelectItem value={option.value} key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minimum-selection" className="mb-1">
                  Minimum selection
                </Label>
                <Input type="number" id="minimum-selection" />
              </div>
              <div>
                <Label htmlFor="maximum-selection" className="mb-1">
                  Maximum selection
                </Label>
                <Input type="number" id="maximum-selection" />
              </div>
            </Panel>
          )}
          <Panel
            title="Logic"
            isOpen={openPanel === 'logic'}
            onClick={() => setOpenPanel('logic')}
          >
            Logic content
          </Panel>
          <Panel
            title="Validation"
            onClick={() => setOpenPanel('validation')}
            isOpen={openPanel === 'validation'}
          >
            Validation content
          </Panel>
        </>
      ) : (
        <div className="flex justify-center p-4">
          <p className="text-center text-muted-foreground">
            Create a question to get started
          </p>
        </div>
      )}
    </aside>
  );
};

function Droppable({children}: React.PropsWithChildren) {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const style = {
    backgroundColor: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

function Sortable({
  children,
  className,
  id,
  isDisabled,
}: React.PropsWithChildren<{
  id: string;
  className?: string;
  isDisabled?: boolean;
}>) {
  const {attributes, listeners, setNodeRef, transform, isSorting} = useSortable(
    {
      id,
      disabled: isDisabled,
    },
  );
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <>
      <div ref={setNodeRef} style={style} className={className}>
        <Button
          size="icon"
          variant="ghost"
          disabled={isDisabled}
          style={{cursor: isSorting ? 'grabbing' : 'grab'}}
          {...listeners}
          {...attributes}
        >
          <DragHandleDots2Icon className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </>
  );
}

type Props = {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
};

const Panel = ({children, title, isOpen = false, onClick}: Props) => (
  <div
    className={cn('flex flex-col', {
      'flex-1': isOpen,
    })}
  >
    <button className="w-full border-b p-4 text-left" onClick={onClick}>
      <h2
        className={cn(
          'text-md leading-none text-muted-foreground transition-colors hover:text-foreground',
          {
            'font-medium text-foreground': isOpen,
          },
        )}
      >
        {title}
      </h2>
    </button>
    {isOpen && (
      <div className="flex flex-1 flex-col gap-4 border-b bg-muted p-4">
        {children}
      </div>
    )}
  </div>
);
