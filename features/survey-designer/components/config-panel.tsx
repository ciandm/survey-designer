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
import {Sortable} from '@/components/sortable';
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
import {useActiveElement} from '../hooks/use-active-element';
import {
  changeElementType,
  deleteQuestionChoice,
  deleteQuestionChoices,
  insertQuestionChoice,
  moveQuestionChoices,
  updateElement,
  updateQuestionChoice,
  useSurveyElements,
} from '../store/survey-designer';
import {QuestionTypeSelect} from './question-type-select';

type Panel = 'element' | 'choices' | 'logic' | 'validation';

const SORT_ORDER_OPTIONS = [
  {label: 'None', value: 'none'},
  {label: 'Ascending', value: 'asc'},
  {label: 'Descending', value: 'desc'},
  {label: 'Random', value: 'random'},
] as const;

export const ConfigPanel = () => {
  const {activeElement} = useActiveElement();

  return (
    <ConfigPanelInner key={`${activeElement?.id}-${activeElement?.type}`} />
  );
};

const ConfigPanelInner = () => {
  const {activeElement} = useActiveElement();
  const elements = useSurveyElements();
  const [openPanel, setOpenPanel] = useState<Panel>('element');

  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const choices = activeElement?.properties.choices ?? [];

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (active.id !== over?.id && activeElement) {
      const choices = activeElement?.properties.choices ?? [];
      const oldIndex = choices.findIndex((choice) => choice.id === active.id);
      const newIndex = choices.findIndex((choice) => choice.id === over?.id);

      const newChoices = arrayMove(choices, oldIndex, newIndex);
      moveQuestionChoices({elementId: activeElement.id, newChoices});
    }
  }

  return (
    <aside className="hidden max-w-sm flex-1 flex-col overflow-auto border-l bg-white lg:flex">
      {activeElement ? (
        <>
          <Panel
            title="element"
            isOpen={openPanel === 'element'}
            onClick={() => setOpenPanel('element')}
          >
            <div>
              <Label htmlFor="element-type">Type</Label>
              <QuestionTypeSelect
                element={activeElement}
                onChange={(type) =>
                  changeElementType({
                    id: activeElement.id,
                    type,
                  })
                }
                id="element-type"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Textarea
                name="title"
                id="title"
                value={activeElement.text}
                onChange={(e) =>
                  updateElement({
                    id: activeElement.id,
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
                value={activeElement.description}
                onChange={(e) =>
                  updateElement({
                    id: activeElement.id,
                    description: e.target.value,
                  })
                }
              />
            </div>
            {(activeElement.type === 'short_text' ||
              activeElement.type === 'long_text') && (
              <div>
                <Label htmlFor="placeholder">Placeholder (optional)</Label>
                <Textarea
                  name="placeholder"
                  id="placeholder"
                  value={activeElement.properties.placeholder}
                  onChange={(e) =>
                    updateElement({
                      id: activeElement.id,
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
                    updateElement({
                      id: activeElement.id,
                      validations: {
                        required: !!checked,
                      },
                    });
                  }}
                  checked={activeElement.validations.required}
                />
                <span>Make this element required</span>
              </label>
              {activeElement.validations.required && (
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
                          If the element is required, this message will be shown
                          if the user tries to submit the form without answering
                          this element. Defaults to &quot;This field is
                          required&quot;.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Textarea
                    name="required"
                    id="required"
                    value={activeElement.properties.required_message}
                    onChange={(e) =>
                      updateElement({
                        id: activeElement.id,
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
          {activeElement.type === 'multiple_choice' && (
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
                      deleteQuestionChoices({elementId: activeElement.id})
                    }
                  >
                    <EraserIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      insertQuestionChoice({
                        elementId: activeElement.id,
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
                          renderSortHandle={({
                            attributes,
                            listeners,
                            isSorting,
                          }) => (
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={choices.length === 1}
                              style={{cursor: isSorting ? 'grabbing' : 'grab'}}
                              {...listeners}
                              {...attributes}
                            >
                              <DragHandleDots2Icon className="h-4 w-4" />
                            </Button>
                          )}
                        >
                          <>
                            <Input
                              type="text"
                              value={choice.value}
                              onChange={(e) =>
                                updateQuestionChoice({
                                  elementId: activeElement.id,
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
                                  elementId: activeElement.id,
                                  choiceId: choice.id,
                                })
                              }
                              disabled={
                                activeElement.properties.choices?.length === 1
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
                  value={activeElement.properties.sort_order ?? 'none'}
                  onValueChange={(value) => {
                    updateElement({
                      id: activeElement.id,
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
      ) : elements.length === 0 ? (
        <div className="flex justify-center p-4">
          <p className="text-center text-muted-foreground">
            Create a element to get started
          </p>
        </div>
      ) : (
        <div className="p-4">
          <Label htmlFor="element-type">Survey title</Label>
          <Textarea id="element-type" />
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

function Sortablex({
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
