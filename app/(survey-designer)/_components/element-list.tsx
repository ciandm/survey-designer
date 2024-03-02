'use client';

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
import {QuestionMarkCircledIcon} from '@radix-ui/react-icons';
import {GripHorizontal} from 'lucide-react';
import {Sortable} from '@/components/sortable';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {useActiveElement} from '@/survey-designer/_hooks/use-active-element';
import {
  useDesignerActions,
  useSurveyElements,
} from '@/survey-designer/_store/survey-designer-store';
import {AddQuestion} from './add-question';
import {ElementCard} from './element-card';

export type ElementListProps = {
  onSettingsClick: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ElementList = ({onSettingsClick}: ElementListProps) => {
  const elements = useSurveyElements();
  const {activeElement} = useActiveElement();

  if (elements.length === 0) {
    return <ElementsEmptyState />;
  }

  return (
    <ElementsDndContext>
      <div className="flex w-full flex-col gap-4 md:gap-8">
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
                    'order-1 hidden items-center justify-center lg:flex',
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
                element={element}
                index={index}
                isActive={isActive}
                onSettingsClick={onSettingsClick}
              />
            </Sortable>
          );
        })}
        <div className="flex items-center gap-2 pr-12">
          <div className="h-[1px] flex-1 border-t" />
          <AddQuestion />
          <div className="h-[1px] flex-1 border-t" />
        </div>
      </div>
    </ElementsDndContext>
  );
};

const ElementsEmptyState = () => {
  return (
    <div className="mx-auto flex flex-col items-center py-12">
      <QuestionMarkCircledIcon className="mx-auto mb-2 h-10 w-10" />
      <h3 className="mt-2 font-semibold text-foreground">No questions yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by adding a new question
      </p>
      <div className="mt-6">
        <AddQuestion />
      </div>
    </div>
  );
};

type ElementsDndContextProps = {
  children: React.ReactNode;
};

const ElementsDndContext = ({children}: ElementsDndContextProps) => {
  const elements = useSurveyElements();
  const {setElements} = useDesignerActions();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={elements.map((element) => element.id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
