'use client';

import {useRef} from 'react';
import {PlusIcon} from '@radix-ui/react-icons';
import {CopyIcon, GripHorizontal, Trash2Icon} from 'lucide-react';
import {ElementCard} from '@/components/element-card';
import {Sortable} from '@/components/sortable';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {useActiveElement} from '@/survey-dashboard/_hooks/use-active-element';
import {useElementCrud} from '@/survey-dashboard/_hooks/use-element-crud';
import {setActiveElementRef} from '@/survey-dashboard/_store/active-element-ref';
import {
  useDesignerActions,
  useSurveyElements,
} from '@/survey-dashboard/_store/survey-designer-store';
import {AddQuestion} from './add-question';
import {Choices, ChoicesAddChoice, ChoicesField, ChoicesList} from './choices';
import {ElementsEmptyState} from './elements-empty-state';
import {QuestionTypeSelect} from './question-type-select';

export const ElementsList = () => {
  const elements = useSurveyElements();
  const {handleRemoveElement, handleDuplicateElement} = useElementCrud();
  const {activeElement} = useActiveElement();
  const {changeElementType} = useDesignerActions();

  const itemsRef = useRef<HTMLDivElement[]>([]);

  if (elements.length === 0) {
    return <ElementsEmptyState />;
  }

  return (
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
            <ElementCard.Root
              id={element.id}
              onClick={() => setActiveElementRef(element.ref)}
              ref={(el) => (itemsRef.current[index] = el as HTMLDivElement)}
              className={cn('cursor-pointer transition-all hover:ring-2', {
                'ring-2': isActive,
                'hover:ring-primary/50': !isActive,
              })}
            >
              <ElementCard.Content number={index + 1}>
                <ElementCard.Title element={element} id={element.id} />
                <div className="mt-4 max-w-sm">
                  {(element.type === 'multiple_choice' ||
                    element.type === 'single_choice') && (
                    <>
                      <Choices
                        elementId={element.id}
                        choices={element.properties.choices}
                      >
                        <ChoicesList>
                          {element.properties.choices?.map((choice, index) => (
                            <ChoicesField
                              index={index}
                              choice={choice}
                              key={choice.id}
                            />
                          ))}
                        </ChoicesList>
                        <ChoicesAddChoice
                          variant="outline"
                          size="sm"
                          className="m-2 ml-12"
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
              </ElementCard.Content>
              <footer className="bg-accent px-5 py-2.5">
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
            </ElementCard.Root>
          </Sortable>
        );
      })}
      <div className="flex items-center gap-2 pr-12">
        <div className="h-[1px] flex-1 border-t" />
        <AddQuestion />
        <div className="h-[1px] flex-1 border-t" />
      </div>
    </>
  );
};
