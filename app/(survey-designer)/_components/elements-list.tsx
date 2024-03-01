'use client';

import {PlusIcon} from '@radix-ui/react-icons';
import {CopyIcon, GripHorizontal, Trash2Icon} from 'lucide-react';
import {Sortable} from '@/components/sortable';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {useActiveElement} from '@/survey-designer/_hooks/use-active-element';
import {useElementCrud} from '@/survey-designer/_hooks/use-element-crud';
import {setActiveElementRef} from '@/survey-designer/_store/active-element-ref';
import {
  useDesignerActions,
  useSurveyElements,
} from '@/survey-designer/_store/survey-designer-store';
import {AddQuestion} from './add-question';
import {Choices, ChoicesAddChoice, ChoicesList} from './choices';
import {ElementsEmptyState} from './elements-empty-state';
import {QuestionTypeSelect} from './question-type-select';

export const ElementsList = () => {
  const elements = useSurveyElements();
  const {handleRemoveElement, handleDuplicateElement} = useElementCrud();
  const {activeElement} = useActiveElement();
  const {changeElementType, updateElement} = useDesignerActions();

  return (
    <>
      {elements.length > 0 ? (
        <>
          {elements.map((element, index) => {
            const isActive = activeElement?.ref === element.ref;
            return (
              <Sortable
                key={element.id}
                id={element.id}
                className="flex w-full flex-1 items-center gap-2"
                isDisabled={elements.length === 1}
                renderSortHandle={({attributes, listeners, isSorting}) => (
                  <Button
                    size="icon"
                    variant="ghost"
                    {...attributes}
                    {...listeners}
                    className={cn(
                      'order-1 flex items-center justify-center',
                      isSorting ? 'cursor-grabbing' : 'cursor-grab',
                      {
                        'cursor-not-allowed': elements.length === 1,
                      },
                    )}
                  >
                    <GripHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              >
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveElementRef(element.ref);
                  }}
                  className={cn(
                    'group flex-1 cursor-pointer overflow-hidden rounded-lg border border-slate-300 bg-card ring-ring ring-offset-2 transition-colors',
                    {
                      'ring-2': isActive,
                      'hover:ring-2 hover:ring-primary/50': !isActive,
                    },
                  )}
                >
                  <div className="flex flex-col gap-6 px-6 pb-2 pt-4">
                    <div className="flex flex-col gap-2">
                      <div className="pointer-events-none mb-2 mt-2 flex gap-2 text-sm font-medium text-muted-foreground">
                        <span>Question {index + 1}</span>
                        <span>•</span>
                        <Badge
                          variant={
                            element.validations.required
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {element.validations.required
                            ? 'Required'
                            : 'Optional'}
                        </Badge>
                      </div>
                      <div className="flex flex-1 flex-col gap-2 rounded-md border border-input">
                        <div className="overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <label htmlFor="title" className="sr-only">
                            Question title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            className="block w-full border-0 bg-transparent px-2.5 pt-1 text-lg font-medium outline-none placeholder:text-gray-400 focus:ring-0 "
                            placeholder="Untitled question"
                            defaultValue={element.text}
                            key={`${element.text}-${element.id}-title`}
                            onBlur={(e) => {
                              updateElement({
                                id: element.id,
                                text: e.target.value,
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                e.currentTarget.blur();
                              }
                            }}
                          />
                          <label htmlFor="description" className="sr-only">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            name="description"
                            id="description"
                            className="block w-full resize-none border-0 bg-transparent px-2.5 py-0 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Description (optional)"
                            defaultValue={element.description}
                            key={`${element.description}-${element.id}-description`}
                            onBlur={(e) => {
                              updateElement({
                                id: element.id,
                                description: e.target.value,
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                e.currentTarget.blur();
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="mt-2 w-full pb-4">
                      {(element.type === 'multiple_choice' ||
                        element.type === 'single_choice') && (
                        <>
                          <Choices
                            elementId={element.id}
                            choices={element.properties.choices}
                          >
                            <ChoicesList />
                            <ChoicesAddChoice
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Add choice
                            </ChoicesAddChoice>
                          </Choices>
                        </>
                      )}
                      {element.type === 'short_text' && (
                        <Input
                          readOnly
                          placeholder={
                            !!element.properties.placeholder
                              ? element.properties.placeholder
                              : 'Your answer here'
                          }
                        />
                      )}
                      {element.type === 'long_text' && (
                        <Textarea
                          readOnly
                          placeholder={
                            !!element.properties.placeholder
                              ? element.properties.placeholder
                              : 'Your answer here'
                          }
                        />
                      )}
                    </div>
                  </div>

                  <footer className="border-t px-5 py-2.5">
                    <div className="grid grid-cols-[200px_1fr] justify-items-end">
                      <QuestionTypeSelect
                        className="h-9 border-0 bg-transparent text-sm font-medium text-muted-foreground"
                        element={element}
                        onChange={(type) =>
                          changeElementType({
                            id: element.id,
                            type,
                          })
                        }
                        onOpenChange={(open) =>
                          open && setActiveElementRef(element.ref)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateElement(element.id);
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
                            handleRemoveElement(element.id);
                          }}
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </footer>
                </div>
              </Sortable>
            );
          })}
          <div className="flex items-center gap-2 pr-12">
            <div className="h-[1px] flex-1 border-t" />
            <AddQuestion />
            <div className="h-[1px] flex-1 border-t" />
          </div>
        </>
      ) : (
        <ElementsEmptyState />
      )}
    </>
  );
};
