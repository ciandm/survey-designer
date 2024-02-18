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
import {useActiveElement} from '../hooks/use-active-element';
import {
  changeElementType,
  deleteQuestionChoice,
  deleteQuestionChoices,
  insertQuestionChoice,
  moveQuestionChoices,
  surveyElementsSelector,
  surveySchemaSelector,
  surveyScreenSelector,
  updateDescription,
  updateElement,
  updateQuestionChoice,
  updateScreen,
  updateTitle,
  useSurveyDesignerStore,
} from '../store/survey-designer';
import {QuestionTypeSelect} from './question-type-select';

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
  const elements = useSurveyDesignerStore(surveyElementsSelector);

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
    <aside className="hidden max-w-sm flex-1 flex-col overflow-auto border-l bg-white p-4 lg:flex">
      {activeElement ? (
        <>
          <div className="flex flex-col space-y-6">
            <div>
              <h2 className="text-base font-semibold leading-7">Question</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Make changes to the question
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
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
            <div className="flex flex-col space-y-1.5">
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
            <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
            <div className="flex flex-col">
              <div className="flex items-center">
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
                  id="required"
                  checked={activeElement.validations.required}
                />
                <Label htmlFor="required">Make this question required</Label>
              </div>
              {activeElement.validations.required && (
                <>
                  <div className="mt-3 flex items-center justify-between">
                    <Label htmlFor="required-error-message">
                      Required error message (optional)
                    </Label>
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
                    id="required-error-message"
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
          </div>
          {activeElement.type === 'multiple_choice' && (
            <>
              <Separator className="my-6" />
              <div className="space-y-6">
                <div>
                  <div className="mb-2 grid grid-cols-[1fr_40px_40px] items-center justify-between gap-2">
                    <p className="text-sm font-medium">Choices</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        deleteQuestionChoices({elementId: activeElement.id})
                      }
                    >
                      <EraserIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
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
                                style={{
                                  cursor: isSorting ? 'grabbing' : 'grab',
                                }}
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
                                variant="ghost"
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
                <div className="space-y-1.5">
                  <Label htmlFor="sort-choices" className="text-sm font-medium">
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
                <div className="space-y-1.5">
                  <Label htmlFor="minimum-selection" className="mb-1">
                    Minimum selection (UI-TODO)
                  </Label>
                  <Input disabled type="number" id="minimum-selection" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="maximum-selection" className="mb-1">
                    Maximum selection (UI-TODO)
                  </Label>
                  <Input type="number" id="maximum-selection" disabled />
                </div>
              </div>
            </>
          )}
        </>
      ) : elements.length === 0 ? (
        <div className="flex justify-center p-4">
          <p className="text-center text-muted-foreground">
            Create a element to get started
          </p>
        </div>
      ) : (
        <SurveyPanel />
      )}
    </aside>
  );
};

const SurveyPanel = () => {
  const schema = useSurveyDesignerStore(surveySchemaSelector);
  const {thank_you, welcome} = useSurveyDesignerStore(surveyScreenSelector);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold leading-7">Survey</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Configure your survey settings
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="survey-title">Title</Label>
        <Textarea
          id="survey-title"
          value={schema.title}
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="survey-description">Description</Label>
        <Textarea
          id="survey-description"
          value={schema.description}
          onChange={(e) => updateDescription(e.target.value)}
        />
      </div>
      <Separator />
      <div>
        <h2 className="text-base font-semibold leading-7">Screens</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Make changes to the screens for your survey
        </p>
      </div>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="welcome-message">Welcome message</Label>
          <Textarea
            id="welcome-message"
            value={welcome.message ?? ''}
            onChange={(e) => updateScreen('welcome', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="completed-message">Thank you message</Label>
          <Textarea
            id="completed-message"
            value={thank_you.message ?? ''}
            onChange={(e) => updateScreen('thank_you', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
