'use client';

import {useRef} from 'react';
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
import {PlusIcon, QuestionMarkCircledIcon} from '@radix-ui/react-icons';
import {GripHorizontal} from 'lucide-react';
import {
  ElementCard,
  ElementCardContent,
  ElementCardTitle,
} from '@/components/element-card';
import {Sortable} from '@/components/sortable';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {useActiveElement} from '../hooks/use-active-element';
import {useElementCrud} from '../hooks/use-element-crud';
import {setActiveElementRef} from '../store/active-element-ref';
import {useDesignerMode} from '../store/designer-mode';
import {
  setElements,
  surveyElementsSelector,
  surveySchemaSelector,
  updateDescription,
  updateTitle,
  useSurveyDesignerStore,
} from '../store/survey-designer';
import {AddQuestion} from './add-question';
import {ContentEditable} from './content-editable';
import {
  QuestionChoices,
  QuestionChoicesField,
  QuestionChoicesList,
} from './question-choices';
import {SurveyPreviewer} from './survey-previewer';

export const SurveyDesigner = () => {
  const designerMode = useDesignerMode();
  const elements = useSurveyDesignerStore(surveyElementsSelector);
  const schema = useSurveyDesignerStore(surveySchemaSelector);
  const {handleRemoveElement, handleDuplicateElement} = useElementCrud();
  const {activeElement} = useActiveElement();
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
      setElements((elements) => {
        const oldIndex = elements.findIndex((q) => q.id === active.id);
        const newIndex = elements.findIndex((q) => q.id === over?.id);

        return arrayMove(elements, oldIndex, newIndex);
      });
    }
  }

  if (designerMode === 'preview') {
    return <SurveyPreviewer />;
  }

  return (
    <section
      className="flex flex-1 flex-col items-start overflow-auto bg-accent pb-6 pl-2 pr-4"
      id="survey-designer"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setActiveElementRef(null);
        }
      }}
    >
      <div className="space-y-2 py-4">
        <ContentEditable
          placeholder="Untitled survey"
          onBlur={(e) => updateTitle(e.target.textContent ?? '')}
          value={schema.title ?? ''}
          className="text-xl font-medium"
        />
        <ContentEditable
          placeholder="Description (optional)"
          onBlur={(e) => updateDescription(e.target.textContent ?? '')}
          value={schema.description ?? ''}
          className="text-base"
        />
      </div>
      {elements.length === 0 ? (
        <div className="mx-auto flex flex-col items-center">
          <QuestionMarkCircledIcon className="mx-auto mb-2 h-10 w-10" />
          <h3 className="mt-2 font-semibold text-foreground">
            No questions yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding a new question
          </p>
          <div className="mt-6">
            <AddQuestion />
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={elements.map((element) => element.id)}
              strategy={verticalListSortingStrategy}
            >
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
                    <ElementCard
                      id={element.id}
                      onClick={() => setActiveElementRef(element.ref)}
                      ref={(el) =>
                        (itemsRef.current[index] = el as HTMLDivElement)
                      }
                      className={cn(
                        'cursor-pointer transition-all hover:ring-2',
                        {
                          'ring-2': isActive,
                          'hover:ring-primary/50': !isActive,
                        },
                      )}
                    >
                      <ElementCardContent number={index + 1}>
                        <ElementCardTitle element={element} id={element.id} />
                        <div className="mt-4 max-w-sm">
                          {element.type === 'multiple_choice' && (
                            <>
                              <QuestionChoices
                                elementId={element.id}
                                choices={element.properties.choices}
                              >
                                {({
                                  handleInsertChoice,
                                  isAddChoiceDisabled,
                                }) => (
                                  <>
                                    <QuestionChoicesList>
                                      {element.properties.choices?.map(
                                        (choice, index) => (
                                          <QuestionChoicesField
                                            index={index}
                                            choice={choice}
                                            key={choice.id}
                                          />
                                        ),
                                      )}
                                    </QuestionChoicesList>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="m-2 ml-12"
                                      onClick={handleInsertChoice}
                                      disabled={isAddChoiceDisabled}
                                    >
                                      <PlusIcon className="mr-2 h-4 w-4" />
                                      Add choice
                                    </Button>
                                  </>
                                )}
                              </QuestionChoices>
                            </>
                          )}
                          {element.type === 'short_text' && (
                            <Input
                              readOnly
                              placeholder={element.properties.placeholder}
                            />
                          )}
                          {element.type === 'long_text' && (
                            <Textarea
                              readOnly
                              placeholder={element.properties.placeholder}
                            />
                          )}
                        </div>
                      </ElementCardContent>
                    </ElementCard>
                  </Sortable>
                );
              })}
              {elements.length > 0 && (
                <div className="flex items-center gap-2 pl-12">
                  <div className="h-[1px] flex-1 border-t" />
                  <AddQuestion />
                  <div className="h-[1px] flex-1 border-t" />
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </section>
  );
};
